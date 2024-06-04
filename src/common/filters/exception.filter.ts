import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ClientError } from '../errors';

class TempError extends Error{
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

@Catch(TempError)
export class GenericHttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = exception.getStatus();

    response.status(statusCode).json({
      code: statusCode >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_CLIENT_ERROR',
    });
  }
}

@Catch(ClientError)
export class ClientErrorFilter implements ExceptionFilter<ClientError<string>> {
  catch(exception: ClientError<string>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.statusCode).json({
      code: exception.code,
      message: exception.message,
    });
  }
}
