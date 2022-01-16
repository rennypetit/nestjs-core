import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  FilterCategoriesDto,
} from '../dto/category.dto';
import { Category } from '../entities/category.entity';
import { Order } from '../posts.model';
import { UsersService } from '../../users/users.service';
import { UploadsService } from '../../uploads/uploads.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private usersService: UsersService,
    private uploadsService: UploadsService,
  ) {}

  async findAll(
    params?: FilterCategoriesDto,
    publish = true, // si no es admin no puede ver los borradores
    admin = false, // para saber si esta en el dashboard o no
  ): Promise<object> {
    const { limit = 10, offset = 0, order = 'DESC' } = params;
    if (!Order[order])
      //! si enviá un parámetro diferente a asc o desc
      throw new ConflictException(`Only uppercase DESC and ASC`);

    //! si la persona no es admin no puede ver post en borradores
    if (!admin) publish = true;

    //* si todo sale bien
    const categories = await this.categoriesRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
      where: { publish },
    });
    const count = await this.categoriesRepository.count();
    return { categories, count };
  }

  async findOne(id: number, admin = false) {
    const Category = await this.categoriesRepository.findOne({
      relations: ['posts', 'user'],
      where: { id },
    });
    //! si no se encuentra el id
    if (!Category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    //! si la persona no es admin no puede ver post en borrador
    if (!Category.publish && admin === false) throw new UnauthorizedException();
    //* si todo sale bien
    return Category;
  }

  async findOneSlug(slug: string): Promise<Category> {
    const Category = await this.categoriesRepository.findOne({
      relations: ['posts', 'user'],
      where: { slug, publish: true },
    });
    //! si no se encuentra el id
    if (!Category)
      throw new NotFoundException(`Category with slug ${slug} not found`);

    //* si todo sale bien
    return Category;
  }

  async create(
    createCategoryDto: CreateCategoryDto,
    publish: boolean,
    userId: number,
  ): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    const data = await this.findByNameAndSlug(
      createCategoryDto.name,
      createCategoryDto.slug,
    );
    //! si el nombre o slug ya están declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    // relación uploads - post -seo
    if (createCategoryDto.seoImageId) {
      //! si la imagen no es valida upload da error desde uploads service
      const upload = await this.uploadsService.findOne(
        createCategoryDto.seoImageId,
      );
      newCategory.seoImage = upload;
    }

    // relación uploads - post
    if (createCategoryDto.imageId) {
      //! si la imagen no es valida upload da error desde uploads service
      const upload = await this.uploadsService.findOne(
        createCategoryDto.imageId,
      );
      newCategory.image = upload;
    }

    // relación user - categories
    if (typeof userId === 'number') {
      const user = await this.usersService.findOneExternal(userId);
      newCategory.user = user;
    } else throw new ConflictException(`userId no valid`);

    // se implementa esto para que se puede leer la propiedad boolean de manera correcta
    newCategory.publish = publish;

    //* si todo sale bien
    return await this.categoriesRepository.save(newCategory);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
    publish?: boolean,
  ) {
    const category = await this.categoriesRepository.findOne(id);
    //! si el Category no existe
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    const data = await this.findByNameAndSlug(
      updateCategoryDto.name,
      updateCategoryDto.slug,
    );
    //! si el nombre o slug ya están declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    // relación uploads - post
    if (updateCategoryDto.seoImageId) {
      //! si la imagen no es valida upload da error desde uploads service
      const upload = await this.uploadsService.findOne(
        updateCategoryDto.seoImageId,
      );
      category.seoImage = upload;
    }

    // relación uploads - post
    if (updateCategoryDto.imageId) {
      //! si la imagen no es valida upload da error desde uploads service
      const upload = await this.uploadsService.findOne(
        updateCategoryDto.imageId,
      );
      category.image = upload;
    }

    // relación user - categories
    if (typeof userId === 'number') {
      const user = await this.usersService.findOneExternal(userId);
      category.user = user;
    } else throw new ConflictException(`userId no valid`);

    // se implementa esto para que se puede leer la propiedad boolean de manera correcta
    category.publish = publish;

    //* si todo sale bien
    this.categoriesRepository.merge(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<any> {
    const Category = await this.categoriesRepository.delete(id);
    //! si no afecto nada
    if (Category.affected === 0)
      throw new NotFoundException(`Category with ID ${id} not found`);
    //* si todo sale bien
    return Category;
  }

  // functions for validation
  findByNameAndSlug(name: string, slug: string) {
    return this.categoriesRepository.findOne({
      where: [{ name }, { slug }],
    });
  }
}
