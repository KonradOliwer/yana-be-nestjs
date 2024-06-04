import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNote, NoteDTO, UpdateNote } from './dtos';
import { ValidationError } from '@nestjs/common';
import { NoteClientError } from './notes.errors';
import { ClientError } from '../common/errors';

@Controller('notes')
export class NotesController {
  constructor(private readonly appService: NotesService) {}

  @Get()
  async getNotes(): Promise<NoteDTO[]> {
    const notes = await this.appService.getNotes();
    return notes.map(
      ({ id, name, content }) => ({ id, name, content }) as NoteDTO,
    );
  }

  @Put(':id')
  updateNotes(
    @Param('id') id: string,
    @Body() updateNote: UpdateNote,
  ): Promise<NoteDTO> {
    if (id !== updateNote.id) {
      throw new ClientError(400, 'VALIDATION_ERROR', 'id: should match url id');
    }
    return this.appService
      .updateNote(updateNote)
      .then()
      // .then(({ id, name, content }) => ({ id, name, content }) as NoteDTO);
  }

  @Post()
  @HttpCode(201)
  async createNotes(@Body() createNote: CreateNote): Promise<NoteDTO> {
    return this.appService
      .createNote(createNote)
      .then(({ id, name, content }) => ({ id, name, content }) as NoteDTO);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteNotes(@Param('id') id: string): Promise<void> {
    return this.appService.deleteNote(id);
  }
}
