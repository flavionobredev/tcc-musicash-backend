import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { AuthGuard } from 'src/main/guards/auth.guard';
import { CreateDefaultEventInputDTO } from '../dtos/create-default-event.dto';

@UseGuards(AuthGuard)
@Controller('api/events')
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
