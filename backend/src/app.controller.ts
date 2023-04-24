import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/getHello')
  getHello() {
    return 'Hello World!';
  }
}
