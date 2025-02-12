import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { UploadModule } from 'src/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [UploadModule, ConfigModule, ApplicationModule],
})
export class StudentModule {}
