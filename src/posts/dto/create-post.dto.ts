import { IsString, IsNotEmpty, Matches } from 'class-validator';
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Matches(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/)
  @IsNotEmpty()
  readonly slug: string;

  @IsString()
  @IsNotEmpty()
  readonly image: string;
}
