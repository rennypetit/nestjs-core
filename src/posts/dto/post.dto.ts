import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsPositive,
  Min,
  IsBoolean,
  IsArray,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Order } from '../posts.model';
export class CreatePostDto {
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

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
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

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  readonly publish: boolean;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  readonly imageId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly imageAlt: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly categoriesIds: number[];
}
export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class FilterPostsDto {
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
