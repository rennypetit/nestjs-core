import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.API_KEY);
    return process.env.API_KEY;
  }
}
