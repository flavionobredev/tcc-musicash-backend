export class ApplicationException extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'ApplicationException';
    this.statusCode = statusCode;
  }
}

export class UserNotFoundException extends ApplicationException {
  constructor() {
    super('User not found', 404);
    this.name = UserNotFoundException.name;
  }
}

export class InvalidGoogleTokenException extends ApplicationException {
  constructor() {
    super('Invalid Google token', 401);
    this.name = InvalidGoogleTokenException.name;
  }
}
