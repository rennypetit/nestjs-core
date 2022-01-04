import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateUploadDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly alt: string;
}
