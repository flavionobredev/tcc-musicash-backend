import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createAppConfig } from './main/factories/configure-app';

async function bootstrap() {
  const app = createAppConfig(await NestFactory.create(AppModule));
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
