import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventEngagement } from 'src/@core/domain/event/entity/event-engagement.entity';
import { EventMoment } from 'src/@core/domain/event/entity/event-moment.entity';
import { EventEntity } from 'src/@core/domain/event/entity/event.entity';
import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import { MongoModelsName } from '../models.enum';
import {
  EventEngagementSchemaType,
  EventMomentSchemaType,
  EventSchemaType,
} from '../schemas';

@Injectable()
export class MongoDBEventRepository implements EventRepository {
  constructor(
    @Inject(MongoModelsName.Events)
    private readonly eventsModel: Model<EventSchemaType>,
    @Inject(MongoModelsName.EventMoments)
    private readonly eventMomentsModel: Model<EventMomentSchemaType>,
    @Inject(MongoModelsName.EventEngagements)
    private readonly eventEngagementsModel: Model<EventEngagementSchemaType>,
  ) {}

  async create(entity: EventEntity) {
    const session = await this.eventsModel.db.startSession();

    await session.withTransaction(async () => {
      for (const moment of entity.moments) {
        await this.eventMomentsModel.create({
          _id: moment.id,
          event: entity.id,
          title: moment.title,
          description: moment.description,
          start_date: moment.startDate,
          end_date: moment.endDate,
          repertoire: moment.repertoireId,
          members: moment.members.map((member) => ({
            user: member.userId,
            attributes: member.attributes,
          })),
        });
      }

      await this.eventsModel.create({
        _id: entity.id,
        title: entity.title,
        description: entity.description,
        type: entity.type,
        start_date: entity.startDate,
        end_date: entity.endDate,
        owner: entity.ownerId,
        moments: entity.moments.map((moment) => moment.id),
      });
    });

    await session.endSession();
  }

  async findById(id: string): Promise<EventEntity> {
    const result = await this.eventsModel.findById(id).populate('moments');
    if (!result) return null;

    const event = new EventEntity({
      id: result._id.toHexString(),
      title: result.title,
      description: result.description,
      startDate: result.start_date,
      endDate: result.end_date,
      ownerId: result.owner.toHexString(),
      type: result.type,
      updatedAt: result.updated_at,
      createdAt: result.created_at,
    });

    (result.moments as unknown as EventMomentSchemaType[]).forEach((moment) => {
      event.addMoment(
        new EventMoment({
          id: moment._id.toHexString(),
          title: moment.title,
          description: moment.description,
          startDate: moment.start_date,
          endDate: moment.end_date,
          repertoireId: moment.repertoire.toHexString(),
          // members: moment.members.map(
          //   (member) =>
          //     new EventMomentMember(
          //       member.user.toHexString(),
          //       member.attributes as EventMomentMemberAttribute[],
          //     ),
          // ),
        }),
      );
    });

    return event;
  }

  async upsertEngagementByEventAndUser(eventEngagement: EventEngagement) {
    const json = eventEngagement.toJSON();

    await this.eventEngagementsModel.updateOne(
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
  }
}
