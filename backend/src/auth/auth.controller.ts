import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return {
      token: token.access_token,
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    const user: { userId: number; email: string; roles: string[] } = req.user;
    if (await this.authService.checkUserBanned(user.userId)) {
      throw new ForbiddenException();
    }
    return true;
  }
}

