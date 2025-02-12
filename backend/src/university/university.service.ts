import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { File } from '@nest-lab/fastify-multer';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
} from './dto/create-university.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UniversityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  async createUniversity(universityData: CreateUniversityDto) {
    try {
      const existingUniversity = await this.prisma.university.findFirst({
        where: {
          university_name: universityData.university_name,
          country: universityData.country,
          location: universityData.location,
        },
      });

      if (existingUniversity) {
        throw new HttpException(
          'University with these details already exists',
          HttpStatus.CONFLICT,
        );
      }

      const university = await this.prisma.university.create({
        data: universityData,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'University created successfully',
        data: university,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'Invalid university data provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.error('Error creating university:', error);
      throw new HttpException(
        'Unable to create university. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number) {
    const data = await this.prisma.university.findUnique({
      where: {
        id,
      },
      include: {
        courses: true,
      },
    });

    return { data };
  }

  async updateUniversity(universityData: UpdateUniversityDto, id: number) {
    try {
      const existingUniversity = await this.prisma.university.findUnique({
        where: { id },
      });

      if (!existingUniversity) {
        throw new HttpException('University not found', HttpStatus.NOT_FOUND);
      }

      const university = await this.prisma.university.update({
        where: { id },
        data: universityData,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'University updated successfully',
        data: university,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          'Invalid university data provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.error('Error updating university:', error);
      throw new HttpException(
        'Unable to update university. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUniversity(id: number) {
    try {
      const existingUniversity = await this.prisma.university.findUnique({
        where: { id },
      });

      if (!existingUniversity) {
        throw new HttpException('University not found', HttpStatus.NOT_FOUND);
      }

      const university = await this.prisma.university.delete({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'University deleted successfully',
        data: university,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error deleting university:', error);
      throw new HttpException(
        'Unable to delete university. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUniversity(id: number) {
    try {
      const university = await this.prisma.university.findUnique({
        where: { id },
      });

      if (!university) {
        throw new HttpException('University not found', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        data: university,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error fetching university:', error);
      throw new HttpException(
        'Unable to fetch university. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUniversities() {
    try {
      const universities = await this.prisma.university.findMany({
        include: {
          courses: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: universities,
      };
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw new HttpException(
        'Unable to fetch universities. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadDocs(
    university_id: number,
    files: {
      university_document: File[];
      university_logo: File[];
    },
  ) {
    try {
      // Validate university exists
      const existingUniversity = await this.prisma.university.findUnique({
        where: { id: university_id },
      });

      if (!existingUniversity) {
        throw new HttpException('University not found', HttpStatus.NOT_FOUND);
      }

      // Validate file inputs
      if (
        !files.university_document?.length ||
        !files.university_logo?.length
      ) {
        throw new HttpException(
          'Both university document and logo are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Generate file names
      const document = `university/${university_id}_document.${files.university_document[0].originalname.split('.').at(-1)}`;
      const university_logo = `university/${university_id}_university_logo.${files.university_logo[0].originalname.split('.').at(-1)}`;

      // Upload files
      const promises = [
        this.uploadService.upload(
          document,
          files.university_document[0].buffer,
          files.university_document[0].mimetype,
          this.configService.getOrThrow('PUBLIC_DOC_BUCKET'),
        ),
        this.uploadService.upload(
          university_logo,
          files.university_logo[0].buffer,
          files.university_logo[0].mimetype,
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

      const universityLogoUrl = `${this.configService.getOrThrow('SUPABASE_AWS_S3_PUBLIC_ACCESS_URL')}/${university_logo}`;
      const documentUrl = `${this.configService.getOrThrow('SUPABASE_AWS_S3_PUBLIC_ACCESS_URL')}/${document}`;

      // Update university with new document URLs
      await this.prisma.university.update({
        where: {
          id: university_id,
        },
        data: {
          document_url: documentUrl,
          logo_url: universityLogoUrl,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Documents uploaded successfully',
        data: {
          university_document: documentUrl,
          university_logo: universityLogoUrl,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Error uploading university documents:', error);
      throw new HttpException(
        'Unable to upload documents. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
