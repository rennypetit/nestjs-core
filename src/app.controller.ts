import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('docs')
  @ApiBearerAuth()
  @Get('nuevo')
  newEndpoint() {
    return 'yo soy nuevo';
  }
}
