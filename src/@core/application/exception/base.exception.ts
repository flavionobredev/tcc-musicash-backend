export class ApplicationException extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApplicationException';
    this.statusCode = statusCode;
  }
}
