import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';

import { Role } from 'src/users/users.model';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Upload } from './entities/upload.entity';
import { FilterUploadsDto } from './dto/create-upload.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Roles(Role.ADMIN, Role.EDITOR)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uplodas',
        filename: (req, file, cb): void => {
          cb(null, file.originalname);
        },
      }),
      limits: { fileSize: 500000 }, // 1kb to byte = 1000 byte
      fileFilter: (req, file, cb): void => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|web|gif)$/)) {
          return cb(null, false);
        }
        return cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Upload> {
    if (!file) throw new BadRequestException('file is not an image');
    return this.uploadsService.create(file);
  }

  @Roles(Role.ADMIN, Role.EDITOR, Role.READER)
  @Get()
  findAll(@Query() params: FilterUploadsDto): Promise<object> {
    //(params, publish, admin)
    return this.uploadsService.findAll(params);
  }

  @Roles(Role.ADMIN, Role.EDITOR, Role.READER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Upload> {
    //(id, admin)
    return this.uploadsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.EDITOR)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.uploadsService.remove(id);
  }
}
