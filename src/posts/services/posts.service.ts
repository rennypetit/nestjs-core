import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePostDto, UpdatePostDto, FilterPostsDto } from '../dto/post.dto';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';
import { Order } from '../posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(params?: FilterPostsDto): Promise<object> {
    const { limit = 10, offset = 0, order = 'DESC', publish } = params;
    if (!Order[order])
      //! si envia un parametro diferente a asc o desc
      throw new ConflictException(`Only uppercase DESC and ASC`);

    //* si todo sale bien
    const posts = await this.postsRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
      where: { publish: 'true' },
    });
    const count = await this.postsRepository.count();
    return { posts, count };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      relations: ['categories'],
      where: { id },
    });
    //! si no se encuentra el id
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    //* si todo esta bien
    return post;
  }
  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = this.postsRepository.create(createPostDto);
    const data = await this.findByNameAndSlug(
      createPostDto.name,
      createPostDto.slug,
    );
    //! si el nombre o slug ya estan declarados
    if (data) throw new ConflictException(`Name or slug existent`);

    if (createPostDto.categoriesIds) {
      const categories = await this.categoriesRepository.findByIds(
        createPostDto.categoriesIds,
      );
      newPost.categories = categories;
    }

    //* si todo sale bien
    return await this.postsRepository.save(newPost);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postsRepository.findOne(id);
    //! si el post no existe
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

    const data = await this.findByNameAndSlug(
      updatePostDto.name,
      updatePostDto.slug,
    );
    //! si el nombre o slug ya estan declarados
    if (data) throw new ConflictException(`Name or slug existent`);

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
