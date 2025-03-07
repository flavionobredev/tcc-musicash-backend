import { makeId } from 'test/@shared/generators/id.generator';
import { BaseEntity } from './base.entity';

describe('BaseEntity', () => {
  it('should be created with a random UUID', () => {
    const entity = new BaseEntity();
    expect(entity.id).toBeDefined();
  });

  it('should be create passing an id', () => {
    const id = makeId();
    const entity = new BaseEntity({ id });
    expect(entity.id).toBe(id);
  });

  it('should throw an error if the id is invalid', () => {
    expect(() => new BaseEntity({ id: 'invalid-id' })).toThrow(
      'Invalid ObjectId',
    );
  });

  it('should be created with a createdAt date', () => {
    const entity = new BaseEntity();
    expect(entity.createdAt).toBeInstanceOf(Date);
  });

  it('should be create passing a createdAt date', () => {
    const createdAt = new Date();
    const entity = new BaseEntity({ createdAt });
    expect(entity.createdAt).toBe(createdAt);
  });

  it('should throw an error if the createdAt is invalid', () => {
    expect(
      () => new BaseEntity({ createdAt: new Date('invalid-date') }),
    ).toThrow('Invalid createdAt');
  });

  it('should be create passing an updatedAt date', () => {
    const updatedAt = new Date();
    const entity = new BaseEntity({ updatedAt });
    expect(entity.updatedAt).toBe(updatedAt);
  });

  it('should throw an error if the updatedAt is invalid', () => {
    expect(
      () => new BaseEntity({ updatedAt: new Date('invalid-date') }),
    ).toThrow('Invalid updatedAt');
  });
});
