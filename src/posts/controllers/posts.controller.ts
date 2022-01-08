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
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePostDto, UpdatePostDto, FilterPostsDto } from '../dto/post.dto';
import { Post as PostEntity } from '../entities/post.entity';
import { PostsService } from '../services/posts.service';
import { Role } from '../../users/users.model';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Public()
  @Get('/public')
  findAllPublic(@Query() params: FilterPostsDto): Promise<object> {
    return this.postsService.findAll(params);
  }

  @Public()
  @Get('/public/:id')
  findOnePublic(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  //? ALL ADMIN DASHBOARD
  @Roles(Role.ADMIN, Role.EDITOR, Role.READER)
  @Get()
  findAll(
    // se parara el publish para tener el boolean propio
    @Query('publish', ParseBoolPipe) publish: boolean,
    @Query() params: FilterPostsDto,
  ): Promise<object> {
    return this.postsService.findAll(params, publish, true);
  }

  @Roles(Role.ADMIN, Role.EDITOR, Role.READER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    //(id, admin)
    return this.postsService.findOne(id, true);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Body('publish', ParseBoolPipe) publish: boolean,
    @Req() request,
  ): Promise<any> {
    // se obtiene el user sub que es el id por el token
    return this.postsService.create(createPostDto, publish, request.user.sub);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Body('publish', ParseBoolPipe) publish: boolean,
    @Req() request,
  ): Promise<PostEntity> {
    // se obtiene el user sub que es el id por el token
    return this.postsService.update(
      id,
      updatePostDto,
      publish,
      request.user.sub,
    );
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.remove(id);
  }
}
