import { ClientError } from '../common/errors';

export const NOTES_ERROR_CODES = [
  'NOTE_ALREADY_EXISTS',
  'UNKNOWN_ERROR_CODE',
  'NOTE_NOT_FOUND',
] as const;

type NotesErrorCode = (typeof NOTES_ERROR_CODES)[number];

export class NoteClientError extends ClientError<NotesErrorCode> {}
