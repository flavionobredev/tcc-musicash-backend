import { User } from './user.entity';

describe('UserEntity unit tests', () => {
  it('should create a new UserEntity instance', () => {
    const input = {
      email: 'teste@teste.com',
      name: 'Teste',
    };
    const userEntity = new User(input);

    expect(userEntity.email).toBe(input.email);
    expect(userEntity.name).toBe(input.name);
  });

  it('should throw an error if email is invalid', () => {
    const input = {
      email: '',
      name: 'Teste',
    };

    expect(() => new User(input)).toThrow('Invalid user email');
  });

  it('should throw an error if email is too long', () => {
    const input = {
      email: 'teste@teste.co' + 'm'.repeat(256),
      name: 'Teste',
    };

    expect(() => new User(input)).toThrow('Email is too long');
  });

  it('should throw an error if name is invalid', () => {
    const input = {
      email: 'teste@teste.com',
      name: '',
    };

    expect(() => new User(input)).toThrow('Invalid user name');
  });

  it('should throw an error if name is too long', () => {
    const input = {
      email: 'teste@teste.com',
      name: 'Teste'.repeat(256),
    };

    expect(() => new User(input)).toThrow('Name is too long');
  });

  it('should throw an error if picture url is invalid', () => {
    const input = {
      email: 'teste@com.com',
      name: 'Teste',
      picture: 'Invalid picture url',
    };

    expect(() => new User(input)).toThrow('Invalid picture url');
  });
});
