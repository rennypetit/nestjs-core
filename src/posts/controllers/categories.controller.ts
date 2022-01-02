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

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  FilterCategoriesDto,
} from '../dto/category.dto';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../../users/users.model';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get('/public')
  findAllPublic(@Query() params: FilterCategoriesDto): Promise<object> {
    return this.categoriesService.findAll(params);
  }

  @Public()
  @Get('/public/:id')
  findOnePublic(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  //? ALL ADMIN DASHBOARD
  @Roles(Role.ADMIN, Role.EDITOR, Role.READER)
  @Get()
  findAll(
    // se parara el publish para tener el boolean propio
    @Query('publish', ParseBoolPipe) publish: boolean,
    @Query() params: FilterCategoriesDto,
  ): Promise<object> {
    //(params, publish, admin)
    return this.categoriesService.findAll(params, publish, true);
  }

  @Roles(Role.ADMIN, Role.EDITOR, Role.READER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    //(id, admin)
    return this.categoriesService.findOne(id, true);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Body('publish', ParseBoolPipe) publish: boolean,
    // se parara el publish para tener el boolean propio
    @Req() request,
  ): Promise<Category> {
    // se obtiene el user sub que es el id por el token
    return this.categoriesService.create(
      createCategoryDto,
      publish,
      request.user.sub,
    );
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Body('publish', ParseBoolPipe) publish: boolean,
    // se parara el publish para tener el boolean propio
    @Req() request,
  ): Promise<Category> {
    // se obtiene el user sub que es el id por el token
    return this.categoriesService.update(
      id,
      updateCategoryDto,
      publish,
      request.user.sub,
    );
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
