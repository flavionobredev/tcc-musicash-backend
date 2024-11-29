import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EntityValidationException } from 'src/@core/@shared/exception/domain.exception';

@Catch(EntityValidationException)
export class HttpEntityValidationExceptionFilter implements ExceptionFilter {
  catch(exception: EntityValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('EntityValidationException', exception);
    response.status(422).json({
      message: exception.message,
      error: exception.name,
    });
  }
}
