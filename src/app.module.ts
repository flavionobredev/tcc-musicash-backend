import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [DatabaseModule, EventsModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}
