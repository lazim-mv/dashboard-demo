import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShortlistDto } from './dto/shortlist.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ApplyDto } from './dto/apply.dto';
import { NotFound } from '@aws-sdk/client-s3';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async addToShortlist(partner_id: number, id: number, body: ShortlistDto) {
    try {
      const shortlist = await this.prisma.courseShortlist.findUnique({
        where: {
          student_id_course_id: {
            student_id: id,
            course_id: body.course_id,
          },
        },
        select: {
          student: {
            select: {
              partner_id: true,
            },
          },
        },
      });
      if (shortlist && shortlist?.student?.partner_id !== partner_id) {
        throw new NotFoundException('Student not found.');
      }
      if (shortlist) {
        throw new ConflictException('Course already in shortlist.');
      }
      const data = await this.prisma.student.update({
        select: {
          course_shortlist: {
            include: {
              course: true,
            },
          },
        },
        where: {
          partner_id,
          id,
        },
        data: {
          course_shortlist: {
            createMany: {
              data: {
                intake: body.intake,
                course_id: body.course_id,
              },
            },
          },
        },
      });
      return { data: data.course_shortlist };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found');
    }
  }

  async getStudentCourseShortlist(partner_id: number, id: number) {
    const data = await this.prisma.courseShortlist.findMany({
      where: {
        student: {
          partner_id,
          id,
        },
      },
      include: {
        course: {
          include: {
            university: true,
          },
        },
      },
    });
    if (data.length === 0) {
      throw new NotFoundException('No courses are shortlisted.');
    }
    return { data };
  }

  async removeFromShortlist(
    partner_id: number,
    id: number,
    shortlist_id: number,
  ) {
    try {
      await this.prisma.courseShortlist.delete({
        where: {
          id: shortlist_id,
          student: {
            partner_id,
            id,
          },
        },
      });
      return { message: 'Course removed from shortlist' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Shorlist not found.');
    }
  }

  async apply(partner_id: number, id: number, body: ApplyDto) {
    try {
      const shortlist = await this.prisma.courseShortlist.findUnique({
        select: {
          course: true,
          intake: true,
        },
        where: {
          id: body.shortlist_id,
          student: {
            partner_id,
            id,
          },
        },
      });
      if (!shortlist) {
        throw new BadRequestException("Couldn't fetch shortlisted course.");
      }
      const data = await this.prisma.student.update({
        select: {
          applications: true,
        },
        where: {
          partner_id,
          id,
        },
        data: {
          applications: {
            create: {
              name: shortlist.course.name,
              awards: shortlist.course.awards,
              level: shortlist.course.level,
              intake: shortlist.intake,
              subject: shortlist.course.subject,
              duration: shortlist.course.duration,
              tution_fee: Number.parseFloat(shortlist.course.tution_fee),
              requirements: shortlist.course.requirements,
              course_id: shortlist.course.id,
            },
          },
        },
      });
      return { data: data.applications };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found');
    }
  }

  async getStudentCourseApplications(partner_id: number, id: number) {
    const data = await this.prisma.application.findMany({
      where: {
        student: {
          partner_id,
          id,
        },
      },
      include: {
        course: {
          include: {
            university: true,
          },
        },
      },
    });
    if (data.length === 0) {
      throw new NotFoundException('No courses are shortlisted.');
    }
    return { data };
  }

  async removeApplication(
    partner_id: number,
    id: number,
    application_id: number,
  ) {
    try {
      await this.prisma.application.delete({
        where: {
          id: application_id,
          student: {
            partner_id,
            id,
          },
        },
      });
      return { message: 'Application removed' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Application not found.');
    }
  }
}
