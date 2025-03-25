import { Model } from 'mongoose';
import { User } from 'src/@core/domain/user';
import { makeObjectId } from 'test/@shared/generators/id.generator';
import { UserSchemaType } from '../schemas';
import { MongoDBUserRepository } from './user.repository';

describe('MongoDBUserRepository unit tests', () => {
  const makeSut = () => {
    const userModel = {
      updateOne: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
    } as unknown as Model<UserSchemaType>;

    const sut = new MongoDBUserRepository(userModel);
    return { sut, userModel };
  };

  describe('upsertByEmail method', () => {
    it('should call updateOne with correct values', async () => {
      const { sut, userModel } = makeSut();
      const user = new User({
        email: 'any_email@com.com',
        name: 'any_name',
        picture: 'https://any_picture.com',
      });

      await sut.upsertByEmail(user);

      expect(userModel.updateOne).toHaveBeenCalledWith(
        { email: user.email },
        {
          $set: {
            name: user.name,
            picture: user.picture,
          },
          $setOnInsert: {
            _id: user.id,
          },
        },
        { upsert: true },
      );
    });
  });

  describe('findByEmail method', () => {
    it('should return null if user not found', async () => {
      const { sut, userModel } = makeSut();
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      const user = await sut.findByEmail('teste@teste.com');

      expect(user).toBeNull();
    });

    it('should return user if user found', async () => {
      const { sut, userModel } = makeSut();
      const mock = {
        _id: makeObjectId(),
        email: 'teste@teste.com',
        name: 'any_name',
        picture: 'https://any_picture.com',
      };
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mock),
      } as any);

      const user = await sut.findByEmail('teste@teste.com');

      expect(userModel.findOne).toHaveBeenCalledWith({ email: mock.email });
      expect(user).toHaveProperty('id', mock._id.toHexString());
      expect(user).toHaveProperty('email', mock.email);
    });
  });

  describe('findById method', () => {
    it('should return null if user not found', async () => {
      const { sut, userModel } = makeSut();
      jest.spyOn(userModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      const user = await sut.findById('any_id');

      expect(user).toBeNull();
    });

    it('should return user if user found', async () => {
      const { sut, userModel } = makeSut();
      const mock = {
        _id: makeObjectId(),
        email: 'teste@teste.com',
        name: 'any_name',
        picture: 'https://any_picture.com',
      };
      jest.spyOn(userModel, 'findById').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mock),
      } as any);

      const user = await sut.findById(mock._id.toHexString());

      expect(userModel.findById).toHaveBeenCalledWith(mock._id.toHexString());
      expect(user).toHaveProperty('id', mock._id.toHexString());
      expect(user).toHaveProperty('email', mock.email);
    });
  });
});
