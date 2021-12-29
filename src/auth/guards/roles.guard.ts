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

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    // [admin,editor ...]
    if (!roles) return true; // si no tiene roles dejarlo pasar

    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;
    // {role: 'admin', sub: 1}
    const isAuth = roles.some((role) => role === user.role);
    console.log(isAuth);
    if (!isAuth) throw new UnauthorizedException('you role is wrong');
    return isAuth;
  }
}
