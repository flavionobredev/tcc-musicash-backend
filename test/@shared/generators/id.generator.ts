import { Types } from 'mongoose';

export const makeId = () => {
  return new Types.ObjectId().toHexString();
};

export const makeObjectId = () => {
  return new Types.ObjectId();
};
