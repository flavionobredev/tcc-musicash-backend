import { DomainException } from './base.exception';

export class EntityValidationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = EntityValidationException.name;
  }
}
