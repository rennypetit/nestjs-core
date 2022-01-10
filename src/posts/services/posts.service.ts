import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto, UpdatePostDto, FilterPostsDto } from '../dto/post.dto';
import { Order } from '../posts.model';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { Upload } from 'src/uploads/entities/upload.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Upload) private uploadsRepository: Repository<Upload>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(
    params?: FilterPostsDto,
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
    const posts = await this.postsRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
      where: { publish },
    });
    const count = await this.postsRepository.count();
    return { posts, count };
  }

  async findOne(id: number, admin = false): Promise<Post> {
    const post = await this.postsRepository.findOne({
      relations: ['user', 'categories', 'image'],
      where: { id },
    });
    //! si no se encuentra el id
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    //! si la persona no es admin no puede ver post en borrador

    if (!post.publish && admin === false) throw new UnauthorizedException();

    //* si todo esta bien
    return post;
  }

  async findOneSlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      relations: ['user', 'categories', 'image'],
      where: { slug, publish: true },
    });
    //! si no se encuentra el id
    if (!post) throw new NotFoundException(`Post with slug ${slug} not found`);
    //! si la persona no es admin no puede ver post en borrador
    //* si todo esta bien
    return post;
  }

  async create(
    createPostDto: CreatePostDto,
    publish: boolean,
    userId: number,
  ): Promise<any> {
    const newPost = this.postsRepository.create(createPostDto);
    const data = await this.findByNameAndSlug(
      createPostDto.name,
      createPostDto.slug,
    );
    //! si el nombre o slug ya estan declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    // relación categories - post
    if (createPostDto.categoriesIds) {
      const categories = await this.categoriesRepository.findByIds(
        createPostDto.categoriesIds,
      );
      //! si las categorías no son validas
      if (categories.length === 0)
        throw new NotFoundException(
          `Categories with ids ${createPostDto.categoriesIds} not found`,
        );
      newPost.categories = categories;
    }

    // relación uploads - post
    if (createPostDto.imageId) {
      const upload = await this.uploadsRepository.findOne(
        createPostDto.imageId,
      );
      //! si la imagen no es valida
      if (!upload)
        throw new NotFoundException(
          `Image with ID ${createPostDto.imageId} not found`,
        );
      newPost.image = upload;
    }

    // relación user - post
    if (typeof userId === 'number') {
      const user = await this.usersRepository.findOne(userId);
      newPost.user = user;
    } else throw new ConflictException(`userId no valid`);

    //* si todo sale bien
    // se implementa esto para que se puede leer la propiedad boolean de manera correcta
    newPost.publish = publish;

    return await this.postsRepository.save(newPost);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    publish: boolean,
    userId: number,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    //! si el post no existe
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    const data = await this.findByNameAndSlug(
      updatePostDto.name,
      updatePostDto.slug,
    );
    //! si el nombre o slug ya estan declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    // relación categories - post
    if (updatePostDto.categoriesIds) {
      const categories = await this.categoriesRepository.findByIds(
        updatePostDto.categoriesIds,
      );
      //! si las categorías no son validas
      if (categories.length === 0)
        throw new NotFoundException(
          `Categories with ids ${updatePostDto.categoriesIds} not found`,
        );
      post.categories = categories;
    }

    // relación uploads - post
    if (updatePostDto.imageId) {
      const upload = await this.uploadsRepository.findOne(
        updatePostDto.imageId,
      );
      //! si la imagen no es valida
      if (!upload)
        throw new NotFoundException(
          `Image with ID ${updatePostDto.imageId} not found`,
        );
      post.image = upload;
    }

    // relación user - post
    if (typeof userId === 'number') {
      const user = await this.usersRepository.findOne(userId);
      post.user = user;
    } else throw new ConflictException(`userId no valid`);

    // se implementa esto para que se puede leer la propiedad boolean de manera correcta
    post.publish = publish;

    //* si todo sale bien
    this.postsRepository.merge(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<any> {
    const post = await this.postsRepository.delete(id);
    //! si no afecto nada
    if (post.affected === 0)
      throw new NotFoundException(`Post with ID ${id} not found`);
    //* all ok
    return post;
  }

  // functions for validation
  findByNameAndSlug(name: string, slug: string): Promise<object> {
    return this.postsRepository.findOne({
      where: [{ name }, { slug }],
    });
  }
}
