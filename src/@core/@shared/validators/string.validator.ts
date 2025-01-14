import { validate } from 'uuid';

export const isUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export function isUUID(uuid: string): boolean {
  return validate(uuid);
}

export function isEmail(email: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])*(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/.test(
    email,
  );
}
