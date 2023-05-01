import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/user/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UsersService } from 'src/user/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { S3Service } from 'src/s3/s3.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: 'secretKey',
      secret: 'secretKey',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    UsersService,
    ConfigService,
    JwtStrategy,
    S3Service,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
