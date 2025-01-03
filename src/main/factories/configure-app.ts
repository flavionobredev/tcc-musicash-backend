import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  HttpApplicationExceptionFilter,
  HttpDomainExceptionFilter,
  HttpEntityValidationExceptionFilter,
} from 'src/main/exceptions';

export function createAppConfig(app: INestApplication) {
  app.useGlobalFilters(
    new HttpApplicationExceptionFilter(),
    new HttpDomainExceptionFilter(),
    new HttpEntityValidationExceptionFilter(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: 422,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3010', 'http://localhost:3001'],
  });
  return app;
}
