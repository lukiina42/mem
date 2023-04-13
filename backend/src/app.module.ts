import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UsersModule } from './user/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { UsersService } from './user/users.service';
import { JwtService } from '@nestjs/jwt';
import { Mem } from './mem/mem.entity';
import { MemsModule } from './mem/mem.module';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Mem],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    MemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UsersService, JwtService, S3Service],
})
export class AppModule {}
