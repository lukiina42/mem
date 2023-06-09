import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  BadRequestException,
  ClassSerializerInterceptor,
  UseInterceptors,
  Put,
  UseGuards,
  Request,
  UploadedFile,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JWTReqUser } from 'src/types';
import { Roles } from './roles/role.decorator';
import { Role } from './roles/role.enum';
import { RolesGuard } from './roles/roles.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.findOneByIdWithAvatar(id);
    return user;
  }

  @Get()
  async getAllUsers() {
    return await this.userService.findAll();
  }

  @Get('recommendation/potentialFriends')
  @UseGuards(JwtAuthGuard)
  async getPotentialFriends(@Request() req: JWTReqUser) {
    const users = await this.userService.findPotentialFriendsOfUser(
      req.user.userId,
    );
    return users;
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
        await this.userService.createUser(
          new User(username, email, password, [Role.USER]),
        );
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

  @Put('/avatar')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(204)
  async updateAvatar(
    @Request() req: JWTReqUser,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.userService.updateAvatar(req.user.userId, image);
  }

  @Put('/follow/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async followUser(@Param('id') id: string, @Request() req: JWTReqUser) {
    await this.userService.followUser(req.user.userId, parseInt(id));
  }

  @Put('/ban/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async banUser(@Param('id') id: string) {
    await this.userService.banUser(id);
  }
}

