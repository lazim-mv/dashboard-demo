import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  AddEmergencyContactDto,
  CreateStudentDto,
  StudentAddressDto,
  UpdateStudentDto,
} from './dto/create-student.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PARTNER_SUPER_ADMIN_ROLE } from 'src/partner/entity/partner.entity';
import { FastifyRequest } from 'fastify';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  AddAcademicInterestDto,
  AddCompletedEducationDto,
  AddLanguagesDto,
} from './dto/education.dto';
import {
  AddTravelHistoryDto,
  AddVisaHealthInfoDto,
} from './dto/travel-immigration.dto';
import { AddRefereeDetailsDto } from './dto/add-referee.dto';
import { AddWorkDetailsDto } from './dto/add-work-details.dto';
import { File, FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { StudentDocumentDto } from './dto/student-document.dto';
import { NextTabDto } from './dto/next-tab.dto';
import { StudentDocuments } from '@prisma/client';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post(':id/next-tab')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async nextTab(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: NextTabDto,
  ) {
    return await this.studentService.nextTab(user.partner_id, id, body);
  }

  @Post('personal-details')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @AuthUser() user: FastifyRequest['user'],
    @Body() body: CreateStudentDto,
  ) {
    return await this.studentService.create(user.partner_id, body);
  }

  @Patch(':id/personal-details')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePersonalDetails(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStudentDto,
  ) {
    return await this.studentService.updatePersonalDetails(
      user.partner_id,
      id,
      body,
    );
  }

  @Get()
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['READ'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@AuthUser() user: FastifyRequest['user']) {
    return await this.studentService.findAll(user.partner_id);
  }

  @Get(':id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['READ'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findById(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.studentService.findById(user.partner_id, id);
  }

  @Get(':id/docs')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['READ'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getStudentDocUrl(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.studentService.getStudentDocUrls(user.partner_id, id);
  }

  @Post(':id/address')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addAddress(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Query('mode') mode: 'PERMANENT' | null,
    @Body() body: StudentAddressDto,
  ) {
    return await this.studentService.addAddress(
      user.partner_id,
      id,
      body,
      mode,
    );
  }

  @Post(':id/emergency-contact')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addEmergencyContact(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddEmergencyContactDto,
  ) {
    return await this.studentService.addEmergencyContact(
      user.partner_id,
      id,
      body,
    );
  }

  @Post(':id/completed-education')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addCompletedEducation(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddCompletedEducationDto,
  ) {
    return await this.studentService.addCompletedEducation(
      user.partner_id,
      id,
      body,
    );
  }

  @Delete(':id/completed-education/:history_id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCompletedEducation(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Param('history_id', ParseIntPipe) history_id: number,
  ) {
    return await this.studentService.deleteCompletedEducation(
      user.partner_id,
      id,
      history_id,
    );
  }

  @Post(':id/academic-interest')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addAcademicInterest(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Query('mode') mode: 'CREATE' | 'UPDATE',
    @Body() body: AddAcademicInterestDto,
  ) {
    return await this.studentService.addAcademicInterest(
      user.partner_id,
      id,
      body,
      mode,
    );
  }

  @Post(':id/languages')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addLanguage(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddLanguagesDto,
  ) {
    return await this.studentService.addLanguage(user.partner_id, id, body);
  }

  @Delete(':id/languages/:lang_id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteLanguage(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Param('lang_id', ParseIntPipe) lang_id: number,
  ) {
    return await this.studentService.deleteLanguage(
      user.partner_id,
      id,
      lang_id,
    );
  }

  @Post(':id/travel-history')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addTravelHistory(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddTravelHistoryDto,
  ) {
    return await this.studentService.addTravelHistory(
      user.partner_id,
      id,
      body,
    );
  }

  @Post(':id/travel-visa-health')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addVisaHealthInfo(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddVisaHealthInfoDto,
  ) {
    return await this.studentService.addVisaHealthInfo(
      user.partner_id,
      id,
      body,
    );
  }

  @Post(':id/referee')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addRefereeDetails(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddRefereeDetailsDto,
  ) {
    return await this.studentService.addRefereeDetails(
      user.partner_id,
      id,
      body,
    );
  }

  @Delete(':id/referee/:referee_id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['UPDATE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeRefereeDetails(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Param('referee_id', ParseIntPipe) referee_id: number,
  ) {
    return await this.studentService.removeRefereeDetails(
      user.partner_id,
      id,
      referee_id,
    );
  }

  @Post(':id/work-details')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addWorketails(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: AddWorkDetailsDto,
  ) {
    return await this.studentService.addWorkDetails(user.partner_id, id, body);
  }

  @Delete(':id/work-details/:work_details_id')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeWorkDetails(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Param('work_details_id', ParseIntPipe) work_details_id: number,
  ) {
    return await this.studentService.removeWorkDetails(
      user.partner_id,
      id,
      work_details_id,
    );
  }

  @Post(':id/upload')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  async uploadFile(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Query('file_name') fileName: keyof StudentDocuments,
    @UploadedFiles()
    files: {
      file: File[];
    },
  ) {
    return this.studentService.upload(
      user.partner_id,
      id,
      fileName,
      files.file[0],
    );
  }

  @Post(':id/set-student-docs')
  @Roles({
    role: PARTNER_SUPER_ADMIN_ROLE,
    permissions: [
      {
        resource: 'STUDENTS',
        actions: ['WRITE'],
      },
    ],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async setStudentDocPath(
    @AuthUser() user: FastifyRequest['user'],
    @Param('id', ParseIntPipe) id: number,
    @Body() body: StudentDocumentDto,
  ) {
    return await this.studentService.setStudentDocPath(
      user.partner_id,
      id,
      body,
    );
  }
}
