import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Order } from 'src/posts/posts.model';
export class CreateUploadDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly image: object;
}

export class FilterUploadsDto {
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
