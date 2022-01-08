import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/posts/posts.model';
import { Repository } from 'typeorm';
import { FilterUploadsDto } from './dto/create-upload.dto';
import { Upload } from './entities/upload.entity';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload) private uploadsRepository: Repository<Upload>,
  ) {}
  async create(file) {
    const newUpload = this.uploadsRepository.create();
    newUpload.url = file.path;
    newUpload.name = file.filename;
    return await this.uploadsRepository.save(newUpload);
  }

  async findAll(params?: FilterUploadsDto): Promise<object> {
    const { limit = 10, offset = 0, order = 'DESC' } = params;
    if (!Order[order])
      //! si enviá un parámetro diferente a asc o desc
      throw new ConflictException(`Only uppercase DESC and ASC`);

    //* si todo sale bien
    const uploads = await this.uploadsRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
    });
    const count = await this.uploadsRepository.count();
    return { uploads, count };
  }

  async findOne(id: number, admin = false) {
    const Upload = await this.uploadsRepository.findOne({
      where: { id },
    });
    //! si no se encuentra el id
    if (!Upload) throw new NotFoundException(`Upload with ID ${id} not found`);

    return Upload;
  }

  async remove(id: number): Promise<object> {
    const Upload = await this.uploadsRepository.delete(id);
    //! si no afecto nada
    if (Upload.affected === 0)
      throw new NotFoundException(`Upload with ID ${id} not found`);
    //* si todo sale bien
    return Upload;
  }
}
