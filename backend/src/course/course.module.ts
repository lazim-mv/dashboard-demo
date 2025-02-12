import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { UploadModule } from 'src/upload/upload.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [UploadModule, ConfigModule],
})
export class CourseModule {}
