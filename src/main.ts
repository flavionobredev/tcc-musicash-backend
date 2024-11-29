import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpApplicationExceptionFilter } from './shared/exceptions/http-application-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.useGlobalFilters(new HttpApplicationExceptionFilter());
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
