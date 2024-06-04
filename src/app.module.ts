import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, //TODO: change to use migration system instead
    }),
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
