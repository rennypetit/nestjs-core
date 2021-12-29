import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto, FilterUsersDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { Order } from './users.model';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    const data = await this.findByEmail(createUserDto.email);
    //! si el email ya  esta declarado
    if (data) throw new ConflictException(`Email existent`);

    //* si todo sale bien
    return await this.usersRepository.save(newUser);
  }

  async findAll(params?: FilterUsersDto): Promise<object> {
    const { limit = 10, offset = 0, order = 'DESC' } = params;
    if (!Order[order])
      //! si envia un parametro diferente a asc o desc
      throw new ConflictException(`Only uppercase DESC and ASC`);

    //* si todo sale bien
    const users = await this.usersRepository.find({
      take: limit,
      skip: offset,
      order: {
        id: order,
      },
    });
    const count = await this.usersRepository.count();
    return { users, count };
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    //! si no se encuentra el id
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    //* si todo esta bien
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(id);
    //! si el user no existe
    if (!user) throw new NotFoundException(`Post with ID ${id} not found`);

    const data = await this.findByEmail(updateUserDto.email);
    //! si el email ya  esta declarado
    if (data) throw new ConflictException(`Email existent`);
    //* si todo sale bien
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.delete(id);
    //! si no afecto nada
    if (user.affected === 0)
      throw new NotFoundException(`user with ID ${id} not found`);
    //* all ok
    return user;
  }

  // functions for validation
  findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}