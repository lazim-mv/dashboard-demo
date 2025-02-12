import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PartnerModule } from './partner/partner.module';
import { UploadModule } from './upload/upload.module';
import { StudentModule } from './student/student.module';
import { UniversityModule } from './university/university.module';
import { CourseModule } from './course/course.module';
import { ConfigModule } from '@nestjs/config';
import { ApplicationRootModule } from './application-root/application-root.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    PartnerModule,
    UploadModule,
    StudentModule,
    UniversityModule,
    CourseModule,
    ConfigModule,
    ApplicationRootModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
