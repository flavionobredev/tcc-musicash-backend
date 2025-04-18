import { Model, Types } from 'mongoose';
import { EventMoment } from 'src/@core/domain/event/entity/event-moment.entity';
import { EventEntity } from 'src/@core/domain/event/entity/event.entity';
import { EventMomentMemberAttribute } from 'src/@core/domain/event/value-object/event-moment-member.vo';
import {
  EventEngagementSchemaType,
  EventMomentSchemaType,
  EventSchemaType,
} from '../schemas';
import { MongoDBEventRepository } from './events.repository';
import { EventEngagement } from 'src/@core/domain/event/entity/event-engagement.entity';
import { makeId } from 'test/@shared/generators/id.generator';

describe('MongoDBEventRepository unit tests', () => {
  const makeSut = () => {
    const eventsModel = {
      db: {
        startSession: jest.fn().mockResolvedValue({
          startTransaction: jest.fn(),
          commitTransaction: jest.fn(),
          endSession: jest.fn(),
          withTransaction: (fn) => fn(),
        }),
      },
      create: jest.fn(),
      findById: jest.fn().mockReturnValue({
        populate: jest.fn(),
      }),
    } as unknown as Model<EventSchemaType>;

    const eventMomentsModel = {
      create: jest.fn(),
    } as unknown as Model<EventMomentSchemaType>;

    const eventEngagementsModel = {
      updateOne: jest.fn(),
    } as unknown as Model<EventEngagementSchemaType>;

    const sut = new MongoDBEventRepository(
      eventsModel,
      eventMomentsModel,
      eventEngagementsModel,
    );
    return { sut, eventsModel, eventMomentsModel, eventEngagementsModel };
  };

  describe('create function', () => {
    it('should create a new event without moments', async () => {
      const { sut, eventsModel, eventMomentsModel } = makeSut();

      await sut.create(
        new EventEntity({
          ownerId: new Types.ObjectId().toHexString(),
          title: 'any_title',
          description: 'any_description',
          startDate: new Date(),
        }),
      );

      expect(eventsModel.db.startSession).toHaveBeenCalled();
      expect(eventsModel.create).toHaveBeenCalled();
      expect(eventMomentsModel.create).not.toHaveBeenCalled();
    });

    it('should create a new event with moments', async () => {
      const { sut, eventsModel, eventMomentsModel } = makeSut();

      await sut.create(
        new EventEntity({
          ownerId: new Types.ObjectId().toHexString(),
          title: 'any_title',
          description: 'any_description',
          startDate: new Date(),
          moments: [
            new EventMoment({
              title: 'any_title',
              startDate: new Date(),
            }),
            new EventMoment({
              title: 'any_title',
              startDate: new Date(),
            }),
          ],
        }),
      );

      expect(eventsModel.db.startSession).toHaveBeenCalled();
      expect(eventsModel.create).toHaveBeenCalled();
      expect(eventMomentsModel.create).toHaveBeenCalledTimes(2);
      expect(eventMomentsModel.create).toHaveBeenCalledWith({
        _id: expect.any(String),
        event: expect.any(String),
        title: 'any_title',
        description: undefined,
        start_date: expect.any(Date),
        end_date: undefined,
        repertoire: undefined,
        members: [],
      });
    });
  });

  describe('findById function', () => {
    it('should return null if event not found', async () => {
      const { sut, eventsModel } = makeSut();

      jest.spyOn(eventsModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await sut.findById('any_id');

      expect(result).toBeNull();
    });

    it('should return an event if found', async () => {
      const { sut, eventsModel } = makeSut();

      jest.spyOn(eventsModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: new Types.ObjectId(),
          title: 'any_title',
          description: 'any_description',
          start_date: new Date(),
          end_date: new Date(),
          owner: new Types.ObjectId(),
          moments: [
            {
              _id: new Types.ObjectId(),
              title: 'any_title',
              description: 'any_description',
              start_date: new Date(),
              end_date: new Date(),
              repertoire: new Types.ObjectId(),
              members: [
                {
                  user: new Types.ObjectId(),
                  attributes: [EventMomentMemberAttribute.SINGER],
                },
              ],
            },
          ],
        }),
      } as any);

      const result = await sut.findById('any_id');

      expect(result).toBeInstanceOf(EventEntity);
      expect(result.moments).toHaveLength(1);
    });
  });

  describe('createEngagement function', () => {
    it('should create an engagement', async () => {
      const { sut, eventEngagementsModel } = makeSut();

      const eventEngagement = EventEngagement.create({
        userId: makeId(),
        eventId: makeId(),
        role: EventEngagement.Roles.OWNER,
      });

      await sut.upsertEngagementByEventAndUser(eventEngagement);

      const json = eventEngagement.toJSON();

      expect(eventEngagementsModel.updateOne).toHaveBeenCalledWith(
        {
          event_id: json.eventId,
          user_id: json.userId,
        },
        {
          $set: {
            role: json.role,
            status: json.status,
          },
          $setOnInsert: {
            _id: json.id,
          },
        },
        { upsert: true },
      );
    });
  });
});
