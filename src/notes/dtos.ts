import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNote implements Omit<NoteDTO, 'id'> {
  @MaxLength(50)
  name: string = '';

  content: string = '';
}

export class UpdateNote implements NoteDTO {
  @IsNotEmpty()
  id: string;

  @MaxLength(50)
  name: string = '';

  content: string = '';
}

export interface NoteDTO {
  id: string;
  name: string;
  content: string;
}
