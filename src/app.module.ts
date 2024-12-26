import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './infra/database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [AdminModule, DatabaseModule, EventsModule, AuthModule],
  controllers: [AppController],
})
export class AppModule {}