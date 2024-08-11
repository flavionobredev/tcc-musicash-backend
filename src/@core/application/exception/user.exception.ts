import { ApplicationException } from './base.exception';

export class UserNotFoundException extends ApplicationException {
  constructor() {
    super('User not found', 404);
    this.name = 'UserNotFoundException';
  }
}
