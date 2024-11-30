import {
  Body,
  Controller,
  Post
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
    const result = await this.createDefaultEventUsecase.execute({
      title: body.title,
      ownerId: 'cec2009f-d703-4606-a8b7-240efe21ea37',
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
    });

    return result;
  }
}
