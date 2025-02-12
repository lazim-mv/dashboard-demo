import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateCourseDto, UpdateCourseDto } from './dto/create-course.dto';
import { ConfigService } from '@nestjs/config';
import { File } from '@nest-lab/fastify-multer';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  async createCourse(data: CreateCourseDto) {
    try {
      // Check if course already exists with same name at the same university
      const existingCourse = await this.prisma.course.findFirst({
        where: {
          name: data.name,
          university_id: data.university_id,
        },
      });

      if (existingCourse) {
        throw new HttpException(
          'Course with this name already exists at this university',
          HttpStatus.CONFLICT,
        );
      }

      // Verify university exists
      const universityExists = await this.prisma.university.findUnique({
        where: { id: data.university_id },
      });

      if (!universityExists) {
        throw new HttpException('University not found', HttpStatus.NOT_FOUND);
      }

      const course = await this.prisma.course.create({
        data,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Course created successfully',
        data: course,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        console.log(error.message);
        console.log(error.name);

        throw new HttpException(
          'Invalid course data provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new HttpException(
            'Course with these details already exists',
            HttpStatus.CONFLICT,
          );
        }
        if (error.code === 'P2003') {
          // Foreign key constraint failure
          throw new HttpException(
            'Referenced university does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw new HttpException(
        'Unable to create course. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCourse(id: number, data: UpdateCourseDto) {
    try {
      // Verify course exists
      const existingCourse = await this.prisma.course.findUnique({
        where: { id },
      });

      if (!existingCourse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      // Check if update would create a duplicate course name at the same university
      if (data.name) {
        const duplicateCourse = await this.prisma.course.findFirst({
          where: {
            name: data.name,
            university_id: data.university_id || existingCourse.university_id,
            id: { not: id },
          },
        });

        if (duplicateCourse) {
          throw new HttpException(
            'Course with this name already exists at this university',
            HttpStatus.CONFLICT,
          );
        }
      }

      const course = await this.prisma.course.update({
        where: { id },
        data,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Course updated successfully',
        data: course,
      };
    } catch (error) {
      console.log(error.message);

      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'Invalid course data provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            'Course with these details already exists',
            HttpStatus.CONFLICT,
          );
        }
        if (error.code === 'P2003') {
          throw new HttpException(
            'Referenced university does not exist',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw new HttpException(
        'Unable to update course. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCourse(id: number) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          university: true,
        },
      });

      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Course fetched successfully',
        data: course,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Unable to fetch course. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllCourses(data?: {
    query?: string;
    skip?: number;
    take?: number;
    universityId?: number;
    orderBy?: 'asc' | 'desc';
  }) {
    try {
      const { query, skip, take, universityId, orderBy = 'asc' } = data || {};

      let where: any = {};

      if (universityId) {
        where.university_id = universityId;
      }

      // Add search query if provided
      if (query) {
        where.OR = [
          {
            name: {
              contains: query,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ];
      }
      // const [courses, total] = await Promise.all([
      //   this.prisma.course.findMany({
      //     where,
      //     skip,
      //     take,
      //     orderBy: { name: orderBy },
      //     include: {
      //       university: {
      //         select: {
      //           country: true,
      //           location: true,
      //         },
      //       },
      //     },
      //   }),
      //   this.prisma.course.count({ where }),
      // ]);

      const [courses, total] =
        skip && take
          ? await Promise.all([
              this.prisma.course.findMany({
                where,
                skip,
                take,
                orderBy: { name: orderBy },
                include: {
                  university: true,
                },
              }),
              this.prisma.course.count({ where }),
            ])
          : await Promise.all([
              this.prisma.course.findMany({
                where,
                orderBy: { name: orderBy },
                include: {
                  university: true,
                },
              }),
              this.prisma.course.count({ where }),
            ]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Courses fetched successfully',
        data: {
          courses,
          meta: {
            total,
            skip,
            take,
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        'Unable to fetch courses. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async filterCourses(data?: {
    query?: string;
    country?: string;
    location?: string;
    level?: string;
    intake?: string;
    subject?: string;
    skip?: number;
    take?: number;
    universityId?: number;
    orderBy?: 'asc' | 'desc';
  }) {
    try {
      const {
        query,
        country,
        location,
        level,
        intake,
        subject,
        skip = 0,
        take = 10,
        universityId,
        orderBy = 'asc',
      } = data || {};

      // Initialize where with AND array
      const where: any = {
        AND: [],
      };

      // Add university ID filter if provided
      if (universityId) {
        where.AND.push({ university_id: universityId });
      }

      // Add country filter
      if (country) {
        where.AND.push({
          university: {
            country: {
              equals: country,
              mode: 'insensitive',
            },
          },
        });
      }

      // Add location filter
      if (location) {
        where.AND.push({
          university: {
            location: {
              equals: location,
              mode: 'insensitive',
            },
          },
        });
      }

      // Add level filter
      if (level) {
        where.AND.push({
          level: {
            equals: level,
            mode: 'insensitive',
          },
        });
      }

      // Add intake filter
      if (intake) {
        where.AND.push({
          intake: {
            contains: intake,
            mode: 'insensitive',
          },
        });
      }

      // Add subject filter
      if (subject) {
        where.AND.push({
          subject: {
            contains: subject,
            mode: 'insensitive',
          },
        });
      }

      // Add search query if provided
      if (query) {
        where.AND.push({
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        });
      }

      // If no filters were applied, remove the empty AND array
      if (where.AND.length === 0) {
        delete where.AND;
      }

      const [courses, total] =
        skip && take
          ? await Promise.all([
              this.prisma.course.findMany({
                where,
                skip,
                take,
                orderBy: { name: orderBy },
                include: {
                  university: true,
                },
              }),
              this.prisma.course.count({ where }),
            ])
          : await Promise.all([
              this.prisma.course.findMany({
                where,
                orderBy: { name: orderBy },
                include: {
                  university: true,
                },
              }),
              this.prisma.course.count({ where }),
            ]);

      return {
        statusCode: HttpStatus.OK,
        message: 'Courses fetched successfully',
        data: {
          courses,
          meta: {
            total,
            skip,
            take,
          },
        },
      };
    } catch (error) {
      console.error('Filter courses error:', error);

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'Invalid filter parameters provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Unable to fetch courses. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteCourse(id: number) {
    try {
      const existingCourse = await this.prisma.course.findUnique({
        where: { id },
      });

      if (!existingCourse) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }

      const course = await this.prisma.course.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Course deleted successfully',
        data: course,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new HttpException(
            'Cannot delete course with existing references',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      throw new HttpException(
        'Unable to delete course. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadDocs(course_id: number, files: { course_document: File[] }) {
    // Validate input files
    if (
      !files ||
      !files.course_document ||
      files.course_document.length === 0
    ) {
      throw new BadRequestException('No files found to upload.');
    }

    const existingCourse = await this.prisma.course.findUnique({
      where: { id: course_id },
    });

    if (!existingCourse) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }

    const file = files.course_document[0];

    // Ensure the file has a valid size and type
    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];

    if (file.size > maxFileSize) {
      throw new BadRequestException(
        'File size exceeds the allowed limit of 5 MB.',
      );
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Allowed types are: PDF, PNG, JPEG.',
      );
    }

    const document = `${course_id}_document.${file.originalname.split('.').pop()}`;

    try {
      const promises = [
        await this.uploadService.upload(
          document,
          file.buffer,
          file.mimetype,
          this.configService.getOrThrow('PUBLIC_DOC_BUCKET'),
        ),
      ];

      const promiseResults = await Promise.allSettled(promises);
      const settled = promiseResults.every((res) => res.status === 'fulfilled');

      if (!settled) {
        // If any upload failed, throw error with details
        const failedUploads = promiseResults
          .filter((res) => res.status === 'rejected')
          .map((res) => (res as PromiseRejectedResult).reason);

        throw new HttpException(
          {
            message: 'Failed to upload one or more files',
            details: failedUploads,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const courseDocUrl = `${this.configService.getOrThrow('SUPABASE_AWS_S3_PUBLIC_ACCESS_URL')}/${document}`;

      await this.prisma.course.update({
        where: { id: course_id },
        data: {
          document_url: courseDocUrl,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Document submitted successfully.',
        data: {
          course_document: courseDocUrl,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to upload the document, please try again. Error: ' +
          error.message,
      );
    }
  }
}
