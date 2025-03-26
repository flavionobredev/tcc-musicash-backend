import { makeId } from 'test/@shared/generators/id.generator';
import { BaseEntity } from './base.entity';

describe('BaseEntity', () => {
  const makeSut = (props?: any) => {
    return new BaseEntity(props);
  };

  it('should be created with a random id', () => {
    const entity = makeSut();
    expect(entity.id).toBeDefined();
  });

  it('should be create passing an id', () => {
    const id = makeId();
    const entity = makeSut({ id });
    expect(entity.id).toBe(id);
  });

  it('should throw an error if the id is invalid', () => {
    expect(() => makeSut({ id: 'invalid-id' })).toThrow('Invalid ObjectId');
  });

  it('should be created with a createdAt date', () => {
    const entity = makeSut();
    expect(entity.createdAt).toBeInstanceOf(Date);
  });

  it('should be create passing a createdAt date', () => {
    const createdAt = new Date();
    const entity = makeSut({ createdAt });
    expect(entity.createdAt).toBe(createdAt);
  });

  it('should throw an error if the createdAt is invalid', () => {
    expect(() => makeSut({ createdAt: new Date('invalid-date') })).toThrow(
      'Invalid createdAt',
    );
  });

  it('should be create passing an updatedAt date', () => {
    const updatedAt = new Date();
    const entity = makeSut({ updatedAt });
    expect(entity.updatedAt).toBe(updatedAt);
  });

  it('should throw an error if the updatedAt is invalid', () => {
    expect(() => makeSut({ updatedAt: new Date('invalid-date') })).toThrow(
      'Invalid updatedAt',
    );
  });

  it('should throw error if toJSON is not implemented', () => {
    const entity = makeSut();
    expect(() => entity.toJSON()).toThrow('Method not implemented.');
  });

  it('should return json when toJSON is implemented', () => {
    class Sut extends BaseEntity {
      constructor(props?: any) {
        super(props);
      }

      toJSON() {
        return {
          id: this.id,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt,
        };
      }
    }
    const entity = new Sut();
    expect(entity.toJSON()).toEqual({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  });
});
