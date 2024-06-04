import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientErrorFilter } from './common/filters/exception.filter';
import { NoteClientError } from './notes/notes.errors';
import { GLOBAL_FILTERS, GLOBAL_PIPES } from './common/global-extentions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(...GLOBAL_FILTERS);
  app.useGlobalPipes(...GLOBAL_PIPES);
  await app.listen(8000);
}

bootstrap();
