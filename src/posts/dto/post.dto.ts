import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { Order } from '../oder.model';
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
  @IsNotEmpty()
  @ApiProperty()
  readonly slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly file: string;
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
}
