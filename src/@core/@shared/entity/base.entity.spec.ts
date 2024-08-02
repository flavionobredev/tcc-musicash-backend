import { randomUUID } from 'node:crypto';
import { BaseEntity } from './base.entity';

describe('BaseEntity', () => {
  it('should be created with a random UUID', () => {
    const entity = new BaseEntity();
    expect(entity.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('should be create passing an id', () => {
    const id = randomUUID();
    const entity = new BaseEntity({ id });
    expect(entity.id).toBe(id);
  });

  it('should throw an error if the id is invalid', () => {
    expect(() => new BaseEntity({ id: 'invalid-id' })).toThrow('Invalid UUID');
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
