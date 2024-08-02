import { isUrl } from './string.validator';

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
});
