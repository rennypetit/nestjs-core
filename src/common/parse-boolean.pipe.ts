import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
//? este pipe es para que no sea obligatorio en el update
export class ParseBooleanPipe implements PipeTransform {
  async transform(value: string | boolean): Promise<boolean> {
    if (value === true || value === 'true') {
      return true;
    }
    if (value === false || value === 'false') {
      return false;
    }
    // si es = a undefined quiere decir que no se paso el dato en el update asi que no es necesario validarlo
    if (value !== undefined)
      throw new BadRequestException(
        'Validation failed (boolean string is expected)',
      );
  }
}
