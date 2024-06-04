import {
  ClientErrorFilter,
  GenericHttpExceptionFilter,
} from './filters/exception.filter';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { ClientError } from './errors';

const validationExceptionFactory = (errors: ValidationError[]) => {
  const result = errors
    .map((error) => error.constraints[Object.keys(error.constraints)[0]])
    .join(`,`);
  return new ClientError(400, 'VALIDATION_ERROR', result);
};

export const GLOBAL_FILTERS = [
  new ClientErrorFilter(),
  new GenericHttpExceptionFilter(),
];

export const GLOBAL_PIPES = [
  new ValidationPipe({
    exceptionFactory: validationExceptionFactory,
  }),
];
