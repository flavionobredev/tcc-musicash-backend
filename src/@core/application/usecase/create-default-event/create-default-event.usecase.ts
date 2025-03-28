import { EventMoment } from 'src/@core/domain/event/entity/event-moment.entity';
import { EventEntity } from 'src/@core/domain/event/entity/event.entity';
import { EventRepository } from 'src/@core/domain/event/repository/event.repository';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';
import { UserRepository } from 'src/@core/domain/user/repository/user.repository';
import { UserNotFoundException } from '../../exception';
import { EventEngagement } from 'src/@core/domain/event/entity/event-engagement.entity';

export type CreateDefaultEventInputDTO = {
  title: string;
  ownerId: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  type?: string;
};

export type CreateDefaultEventOutputDTO = {
  title: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  description: string;
  type: string;
  id: string;
  slug: string;
};

export class CreateDefaultEventUsecase {
  constructor(
    private readonly repertoireRepository: RepertoireRepository,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: CreateDefaultEventInputDTO,
  ): Promise<CreateDefaultEventOutputDTO> {
    const user = await this.userRepository.findById(input.ownerId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const repertoire = new Repertoire({
      title: `Repertório para "${input.title}"`,
    });

    const moment = new EventMoment({
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      repertoireId: repertoire.id,
    });

    const event = new EventEntity({
      title: input.title,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate,
      ownerId: input.ownerId,
      type: input.type,
    });

    event.addMoment(moment);

    const ownerEngagement = EventEngagement.create({
      userId: input.ownerId,
      eventId: event.id,
      role: EventEngagement.Roles.OWNER,
    });

    await this.repertoireRepository.create(repertoire);
    await this.eventRepository.create(event);
    await this.eventRepository.upsertEngagementByEventAndUser(ownerEngagement);

    return {
      title: event.title,
      ownerId: event.ownerId,
      startDate: event.startDate,
      endDate: event.endDate,
      description: event.description,
      type: event.type,
      id: event.id,
      slug: event.slug,
    };
  }
}
