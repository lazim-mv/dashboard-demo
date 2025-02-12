import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [ConfigModule],
  exports: [UploadService],
})
export class UploadModule {}
