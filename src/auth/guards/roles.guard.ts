import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/users.model';
import { PayloadToken } from '../token.model';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findUser(id: number) {
    // se busca el role en el usuario
    return await this.usersRepository.findOne(id);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // roles son los que se declaran en el controlador manualmente
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    // [admin,editor ...]
    if (!roles) return true; // si no tiene roles dejarlo pasar ya que seria método get

    const request = context.switchToHttp().getRequest();
    const token = request.user as PayloadToken;

    //? buscar el id por el token así no enviamos el role en el id
    return this.findUser(token.sub)
      .then(({ role: userRole }) => {
        // se busca si el rol que tiene es el adecuado
        const isAuth = roles.some((role) => role === userRole);
        if (!isAuth) throw new UnauthorizedException('you role is wrong');
        return isAuth;
      })
      .catch(() => {
        return false;
      });
  }
}

// request['dataToken'] = { id, role: userRole }; para insertar data en el request no se esta utilizando es solo ejemplo
