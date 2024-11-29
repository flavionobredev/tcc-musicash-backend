import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [EventsModule],
  controllers: [AppController],
})
export class AppModule {}
