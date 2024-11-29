import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException
} from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { CreateDefaultEventInputDTO } from '../dtos/create-default-event.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly createDefaultEventUsecase: CreateDefaultEventUsecase,
  ) {}

  @Post()
  async createDefaultEvent(@Body() body: CreateDefaultEventInputDTO) {
    if (isNaN(Date.parse(body.startDate)))
      throw new UnprocessableEntityException('Invalid startDate');
    if (body.endDate && isNaN(Date.parse(body.endDate)))
      throw new UnprocessableEntityException('Invalid endDate');

    const result = await this.createDefaultEventUsecase.execute({
      title: body.title,
      ownerId: 'cec2009f-d703-4606-a8b7-240efe21ea37',
      startDate: new Date(body.startDate),
      endDate: body.endDate && new Date(body.endDate),
      description: body.description,
    })

    return result;
  }
}
