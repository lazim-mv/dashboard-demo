import { Module } from '@nestjs/common';
import { ApplicationRootController } from './application-root.controller';
import { ApplicationRootService } from './application-root.service';

@Module({
  controllers: [ApplicationRootController],
  providers: [ApplicationRootService]
})
export class ApplicationRootModule {}
