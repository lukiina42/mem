import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: process.env.CORS_ALLOWED_ORIGIN});
  await app.listen(8080);
}
bootstrap();
