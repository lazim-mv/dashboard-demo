import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { File, FileFieldsInterceptor } from '@nest-lab/fastify-multer';

import { FastifyRequest } from 'fastify';
import { Roles } from 'src/auth/roles.decorator';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createUniversity(@Body() body: CreateUniversityDto) {
    return await this.universityService.createUniversity(body);
  }

  @Get(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.findById(id);
  }

  @Patch(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateUniversity(
    @Body() body: CreateUniversityDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.universityService.updateUniversity(body, id);
  }

  @Delete(':id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUniversity(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.deleteUniversity(id);
  }

  @Get()
  // @Roles({
  //   role: 'SUPER_ADMIN',
  // })
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUniversities() {
    return await this.universityService.getAllUniversities();
  }

  @Post('upload-docs/:id')
  @Roles({
    role: 'SUPER_ADMIN',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'university_document', maxCount: 1 },
      { name: 'university_logo', maxCount: 1 },
    ]),
  )
  async uploadDocs(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      university_document: File[];
      university_logo: File[];
    },
    @Req() req: FastifyRequest,
  ) {
    return await this.universityService.uploadDocs(id, files);
  }
}
