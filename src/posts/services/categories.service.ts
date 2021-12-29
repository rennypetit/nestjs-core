import {
  ConflictException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    const data = await this.findByNameAndSlug(
      createCategoryDto.name,
      createCategoryDto.slug,
    );
    //! si el nombre o slug ya estan declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    //* si todo sale bien
    if (!data) return await this.categoriesRepository.save(newCategory);
  }

  async findAll(params?: FilterCategoriesDto): Promise<object> {
    const { limit = 10, offset = 0, order = 'DESC', publish } = params;
    if (!Order[order])
      //! si envia un parametro diferente a asc o desc
      throw new ConflictException(`Only uppercase DESC and ASC`);

    //* si todo sale bien
    const categories = await this.categoriesRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
      where: { publish: 'true' },
    });
    const count = await this.categoriesRepository.count();
    return { categories, count };
  }

  async findOne(id: number) {
    const Category = await this.categoriesRepository.findOne({
      relations: ['posts'],
      where: { id },
    });
    //! si no se encuentra el id
    if (!Category)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return Category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const Category = await this.categoriesRepository.findOne(id);
    //! si el Category no existe
    if (!Category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    const data = await this.findByNameAndSlug(
      updateCategoryDto.name,
      updateCategoryDto.slug,
    );
    //! si el nombre o slug ya estan declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    //* si todo sale bien
    this.categoriesRepository.merge(Category, updateCategoryDto);
    return this.categoriesRepository.save(Category);
  }

  async remove(id: number) {
    const Category = await this.categoriesRepository.delete(id);
    //! si no afecto nada
    if (Category.affected === 0)
      throw new NotFoundException(`Category with ID ${id} not found`);
    return Category;
  }

  // functions for validation
  findByNameAndSlug(name: string, slug: string) {
    return this.categoriesRepository.findOne({
      where: [{ name }, { slug }],
    });
  }
}
