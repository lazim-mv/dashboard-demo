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
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { FastifyRequest } from 'fastify/types/request';
import { File, FileFieldsInterceptor } from '@nest-lab/fastify-multer';
import { Roles } from 'src/auth/roles.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  // @Roles({
  //   role: 'SUPER_ADMIN',
  // })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllCourses(
    @Query('query') query?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('universityId') universityId?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ) {
    return await this.courseService.getAllCourses({
      query,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      universityId: universityId ? Number(universityId) : undefined,
      orderBy,
    });
  }

  @Get('filter')
  // @Roles({
  //   role: 'SUPER_ADMIN',
  // })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getFilteredCourses(
    @Query('query') query?: string,
    @Query('country') country?: string,
    @Query('location') location?: string,
    @Query('intake') intake?: string,
    @Query('level') level?: string,
    @Query('subject') subject?: string,
    @Query('universityId') universityId?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return await this.courseService.filterCourses({
      query,
      country,
      location,
      level,
      intake,
      subject,
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      universityId: universityId ? Number(universityId) : undefined,
      orderBy,
    });
  }

  @Get(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCourse(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.getCourse(id);
  }

  @Post()
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createCourse(@Body() body: CreateCourseDto) {
    return await this.courseService.createCourse(body);
  }

  @Patch(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCourse(
    @Body() body: UpdateCourseDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.courseService.updateCourse(id, body);
  }

  @Delete(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return await this.courseService.deleteCourse(id);
  }

  @Post('upload-docs/:id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'course_document', maxCount: 1 }]),
  )
  async uploadDocs(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      course_document: File[];
    },
    @Req() req: FastifyRequest,
  ) {
    return await this.courseService.uploadDocs(id, files);
  }
}
