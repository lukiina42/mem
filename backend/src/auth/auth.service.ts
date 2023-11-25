import { Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { compare as comparePasswords } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const validPassword = await comparePasswords(pass, user.password);
      if (!validPassword) return null;
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: 'secretKey',
      }),
    };
  }

  async checkUserBanned(userId: number) {
    return await this.usersService.checkUserBanned(userId);
  }
}

