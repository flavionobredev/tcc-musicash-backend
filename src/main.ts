import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createAppConfig } from './main/factories/configure-app';

async function bootstrap() {
  const app = createAppConfig(await NestFactory.create(AppModule));
  await app.listen(process.env.APP_PORT || 3010);
}
bootstrap();
