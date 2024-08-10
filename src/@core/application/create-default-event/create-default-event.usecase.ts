import { EventMoment } from 'src/@core/domain/event/entity/event-moment.entity';
import { EventEntity } from 'src/@core/domain/event/entity/event.entity';
import { Repertoire } from 'src/@core/domain/repertoire/entity/repertoire.entity';
import { RepertoireRepository } from 'src/@core/domain/repertoire/repository/repertoire.repository';

export type CreateDefaultEventInputDTO = {
  title: string;
  ownerId: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
};

export class CreateDefaultEventUsecase {

  constructor(private readonly repertoireRepository: RepertoireRepository) { }

  async execute(input: CreateDefaultEventInputDTO) {
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
    });

    event.addMoment(moment);

    // TODO: save event and repertoire

    await this.repertoireRepository.create(repertoire);


    return event;
  }
}
