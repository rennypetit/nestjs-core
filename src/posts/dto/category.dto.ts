import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsPositive,
  Min,
  IsBoolean,
  IsNumber,
  IsUrl,
  IsObject,
} from 'class-validator';
import { Order } from '../posts.model';

export class CreateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly seoTitle: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly seoDescription: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly seoKeywords: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty()
  readonly seoCanonical: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly seoImageId: number;

  @IsOptional()
  @ApiProperty()
  readonly seoJsonLd: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
  @IsNotEmpty()
  @ApiProperty()
  readonly slug: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly imageId: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly publish: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class FilterCategoriesDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  order: Order;

  @IsOptional()
  @IsBoolean()
  publish: boolean;
}
