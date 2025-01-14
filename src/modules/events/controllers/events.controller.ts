import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateDefaultEventUsecase } from 'src/@core/application/usecase';
import { User as UserEntity } from 'src/@core/domain/user';
import { User } from 'src/main/decorators';
import { AuthGuard } from 'src/main/guards/auth.guard';
import { CreateDefaultEventInputDTO } from '../dtos/create-default-event.dto';

@UseGuards(AuthGuard)
@Controller('api/events')
export class EventsController {
  constructor(
    private readonly createDefaultEventUsecase: CreateDefaultEventUsecase,
  ) {}

  @Post()
  async createDefaultEvent(
    @Body() body: CreateDefaultEventInputDTO,
    @User() user: UserEntity,
  ) {
    const result = await this.createDefaultEventUsecase.execute({
      title: body.title,
      ownerId: user.id,
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
      type: body.type,
    });

    return result;
  }
}
