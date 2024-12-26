import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ToolsController } from './controllers/tools.controller';
import { BasicAuthMiddleware } from './middleware/basic-auth.middleware';

@Module({
  controllers: [ToolsController],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes('_admin/*');
  }
}
