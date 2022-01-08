import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Role } from 'src/users/users.model';
@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    //! role incorrecto
    if (
      user.role !== Role.ADMIN &&
      user.role !== Role.EDITOR &&
      user.role !== Role.READER
    )
      throw new UnauthorizedException();
    //* si todo sale bien
    return this.authService.generateJWT(user);
  }
}
