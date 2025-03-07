import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserRepository } from 'src/@core/domain/user';
import { MongoModelsName } from '../models.enum';
import { UserSchemaType } from '../schemas';

export class MongoDBUserRepository implements UserRepository {
  constructor(
    @Inject(MongoModelsName.Users)
    private readonly userModel: Model<UserSchemaType>,
  ) {}

  async create(entity: User) {
    throw new Error('Method not implemented.');
  }

  async upsertByEmail(user: User): Promise<void> {
    await this.userModel.updateOne(
      { email: user.email },
      {
        _id: user.id,
        name: user.name,
        picture: user.picture,
      },
      { upsert: true },
    );
  }

  async findByEmail(email: string): Promise<User> {
    const result = await this.userModel.findOne({ email }).lean();
    if (!result) return null;
    return new User({
      id: result._id.toHexString(),
      email: result.email,
      name: result.name,
      picture: result.picture,
    });
  }

  async findById(id: string): Promise<User> {
    const result = await this.userModel.findById(id).lean();
    if (!result) return null;
    return new User({
      id: result._id.toHexString(),
      email: result.email,
      name: result.name,
      picture: result.picture,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    });
  }
}
