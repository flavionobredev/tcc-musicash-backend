import { PrismaClient } from '@prisma/client';
import { EventMoment } from 'src/@core/domain/event/entity/event-moment.entity';
import { EventEntity } from 'src/@core/domain/event/entity/event.entity';
import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import {
  EventMomentMember,
  EventMomentMemberAttribute,
} from 'src/@core/domain/event/value-object/event-moment-member.vo';
import {
  stringArraytoString,
  stringToStringArray,
} from 'test/@shared/utils/prisma/array-parser.util';

export class PrismaEventRepository implements EventRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(entity: EventEntity): Promise<void> {
    await this.prisma.events.create({
      data: {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        type: entity.type,
        startDate: entity.startDate,
        endDate: entity.endDate,
        owner: {
          connect: {
            id: entity.ownerId,
          },
        },
        eventMoments: {
          create: entity.moments.map((moment) => ({
            id: moment.id,
            title: moment.title,
            startDate: moment.startDate,
            endDate: moment.endDate,
            description: moment.description,
            Repertoire: {
              connect: moment.repertoireId && {
                id: moment.repertoireId,
              },
            },
            EventMomentMembers: {
              create: moment.members.map((member) => ({
                user: {
                  connect: {
                    id: member.userId,
                  },
                },
                attributes: stringArraytoString(member.attributes),
              })),
            },
          })),
        },
      },
    });
  }

  async findById(id: string): Promise<EventEntity> {
    const result = await this.prisma.events.findUnique({
      where: { id },
      include: {
        eventMoments: {
          include: {
            EventMomentMembers: true,
          },
        },
      },
    });

    if (!result) return null;

    const event = new EventEntity({
      id: result.id,
      title: result.title,
      description: result.description,
      startDate: result.startDate,
      type: result.type,
      endDate: result.endDate,
      ownerId: result.ownerId,
    });

    result.eventMoments.forEach((moment) => {
      event.addMoment(
        new EventMoment({
          id: moment.id,
          title: moment.title,
          startDate: moment.startDate,
          endDate: moment.endDate,
          description: moment.description,
          repertoireId: moment.repertoireId,
          members: moment.EventMomentMembers.map(
            (member) =>
              new EventMomentMember(
                member.userId,
                stringToStringArray(
                  member.attributes,
                ) as EventMomentMemberAttribute[],
              ),
          ),
        }),
      );
    });

    return event;
  }
}
