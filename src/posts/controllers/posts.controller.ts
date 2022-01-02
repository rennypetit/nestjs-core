import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CreatePostDto, UpdatePostDto, FilterPostsDto } from '../dto/post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { PostsService } from '../services/posts.service';
import { Role } from '../../users/users.model';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get()
  findAll(@Query() params: FilterPostsDto): Promise<object> {
    return this.postsService.findAll(params);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() request,
  ): Promise<PostEntity> {
    // se obtiene el user sub que es el id por el token
    return this.postsService.create(createPostDto, request.user.sub);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request,
  ): Promise<PostEntity> {
    // se obtiene el user sub que es el id por el token
    return this.postsService.update(id, updatePostDto, request.user.sub);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.remove(id);
  }
}
