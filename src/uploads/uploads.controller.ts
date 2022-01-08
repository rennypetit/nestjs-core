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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Upload } from './entities/upload.entity';
import { FilterUploadsDto } from './dto/create-upload.dto';

@ApiTags('Posts')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

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
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
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

  @Get()
  findAll(@Query() params: FilterUploadsDto): Promise<object> {
    //(params, publish, admin)
    return this.uploadsService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Upload> {
    //(id, admin)
    return this.uploadsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.uploadsService.remove(id);
  }
}
