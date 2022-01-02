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
  @Get()
  findAll(@Query() params: FilterCategoriesDto): Promise<object> {
    return this.categoriesService.findAll(params);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.EDITOR)
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request,
  ): Promise<Category> {
    // se obtiene el user sub que es el id por el token
    return this.categoriesService.create(createCategoryDto, request.user.sub);
  }

  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.EDITOR)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() request,
  ): Promise<Category> {
    // se obtiene el user sub que es el id por el token
    return this.categoriesService.update(
      id,
      updateCategoryDto,
      request.user.sub,
    );
  }

  @Roles(Role.ADMIN, Role.COLLABORATOR, Role.EDITOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.remove(id);
  }
}
