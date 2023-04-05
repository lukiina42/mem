import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  BadRequestException,
  NotFoundException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUser(@Param('id') id: number) {
    const user = await this.userService.findOneById(id);
    console.log(user);
    if (!user) throw new NotFoundException(`User with id ${id} was not found`);
    return user;
  }

  @Get()
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post('')
  @HttpCode(204)
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email: string,
  ) {
    if (!password || !username || !email) {
      throw new BadRequestException('All fields must be filled');
    }

    const userByEmail = await this.userService.findOneByEmail(email);
    const userByName = await this.userService.findOneByUsername(username);
    if (!userByEmail) {
      if (!userByName)
        await this.userService.createUser(new User(username, email, password));
      return;
    }

    if (userByEmail && userByName) {
      throw new BadRequestException('EmailNameExist');
    }
    if (userByName) {
      throw new BadRequestException('NameExists');
    }
    if (userByEmail) {
      throw new BadRequestException('EmailExists');
    }
  }
}
