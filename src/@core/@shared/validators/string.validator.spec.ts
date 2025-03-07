import { isEmail, isUrl } from './string.validator';

describe('StringValidator', () => {
  describe('isUrl Function', () => {
    it('should return true if the url is valid', () => {
      const url = 'https://musicImageLink.com';
      expect(isUrl(url)).toBe(true);
    });

    it('should return false if the url is invalid', () => {
      const url = 'invalid-url';
      expect(isUrl(url)).toBe(false);
    });
  });

  describe('isEmail Function', () => {
    it('should return true if the email is valid', () => {
      const email = [
        'teste@teste.com',
        '1@teste.com',
        '1aeerra@1.com',
        'ie#212@g.br.br',
      ];
      email.forEach((e) => {
        expect(isEmail(e)).toBe(true);
      });
    });

    it('should return false if the email is invalid', () => {
      const email = [
        'teste.com',
        'teste@com',
        'teste.com.br',
        '11',
        'teste@.com',
        'teste@com.',
        'teste@.com.',
        '',
        null,
        undefined,
        'null',
        'undefined',
        ' ',
      ];
      email.forEach((e) => {
        expect(isEmail(e)).toBe(false);
      });
    });
  });
});
