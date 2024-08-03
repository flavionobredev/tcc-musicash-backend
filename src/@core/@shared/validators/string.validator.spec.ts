import { randomUUID } from 'node:crypto';
import { isUrl, isUUID } from './string.validator';

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

  describe('isUUID Function', () => {
    it('should return true if the uuid is valid', () => {
      const uuid = randomUUID();
      expect(isUUID(uuid)).toBe(true);
    });

    it('should return false if the uuid is invalid', () => {
      const uuid = 'invalid-uuid';
      expect(isUUID(uuid)).toBe(false);
    });
  });
});
