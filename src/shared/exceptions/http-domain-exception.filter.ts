import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from 'src/@core/@shared/exception/base.exception';

@Catch(DomainException)
export class HttpDomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('DomainException', exception);
    response.status(500).json({
      message: exception.message,
      error: exception.name,
    });
  }
}
