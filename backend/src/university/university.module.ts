import { Module } from '@nestjs/common';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { UploadModule } from 'src/upload/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UniversityController],
  providers: [UniversityService],
  imports: [UploadModule, ConfigModule],
})
export class UniversityModule {}
