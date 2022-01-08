import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { Post } from './entities/post.entity';

import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { Category } from './entities/category.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  imports: [
    UsersModule,
    UploadsModule,
    TypeOrmModule.forFeature([Post, Category]),
  ],
  controllers: [PostsController, CategoriesController],
  providers: [PostsService, CategoriesService, UsersService],
})
export class PostsModule {}
