
export class ClientError<ERROR_CODES> extends Error {
  statusCode: number;
  code: ERROR_CODES;
  message: string;

  constructor(statusCode: number, code: ERROR_CODES, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
  }
}