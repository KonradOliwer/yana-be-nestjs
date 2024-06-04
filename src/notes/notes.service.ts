import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Note } from './note';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNote, UpdateNote } from './dtos';
import { NoteClientError } from './notes.errors';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private notesRepository: Repository<Note>,
  ) {}

  getNotes(): Promise<Note[]> {
    return this.notesRepository.find();
  }

  async createNote(createNote: CreateNote): Promise<Note> {
    try {
      const note = this.notesRepository.create({
        name: createNote.name,
        content: createNote.content,
      });
      return await this.notesRepository.save(note);
    } catch (e) {
      // TODO: After using migration tool to create schema replace to check for constraint name
      if (e.detail === `Key (name)=(${createNote.name}) already exists.`) {
        throw new NoteClientError(
          400,
          'NOTE_ALREADY_EXISTS',
          `Note with name ${createNote.name} already exists.`,
        );
      }
      throw e;
    }
  }

  // As far as I know there is no clean way to  update it in single call, with typeorm. The use of '#update' seams to sometime return 'pending' status, so we would need to add loop for potential wait for finalisation
  async updateNote(updateNote: UpdateNote) {
    const note = await this.notesRepository.findOne({
      where: { id: updateNote.id },
    });
    if (!note) {
      throw new NoteClientError(
        404,
        'NOTE_NOT_FOUND',
        `Note with id ${updateNote.id} not found.`,
      );
    }
    try {
      return await this.notesRepository.save({ ...note, ...updateNote });
    } catch (e) {
      // TODO: After using migration tool to create schema replace to check for constraint name
      if (e.detail === `Key (name)=(${updateNote.name}) already exists.`) {
        throw new NoteClientError(
          400,
          'NOTE_ALREADY_EXISTS',
          `Note with name ${updateNote.name} already exists.`,
        );
      }
      throw e;
    }
  }

  deleteNote(id: string): Promise<void> {
    return this.notesRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new NoteClientError(
          404,
          'NOTE_NOT_FOUND',
          `Note with id ${id} not found.`,
        );
      }
    });
  }
}
