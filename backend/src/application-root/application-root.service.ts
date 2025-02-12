import { Injectable } from '@nestjs/common';
import { Paginator } from 'src/paginator/entity/paginator.entity';
import { Paginate } from 'src/paginator/paginator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ApplicationRootService {
  constructor(private readonly prisma: PrismaService) {}

  async getApplicationsForAdmin(query: Paginator) {
    const take = !isNaN(+query.take) ? +query.take : 10;
    const skip = !isNaN(+query.skip) ? +query.skip : 0;

    const data = await this.prisma.application.findMany({
      take: take + 1,
      skip,
      select: {
        id: true,
        name: true,
        level: true,
        intake: true,
        status: true,
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            university: {
              select: {
                id: true,
                university_name: true,
                country: true,
              },
            },
          },
        },
      },
    });
    return { data: Paginate(data, skip, take) };
  }

  async getApplicationsForPartner(partner_id: number, query: Paginator) {
    const take = !isNaN(+query.take) ? +query.take : 10;
    const skip = !isNaN(+query.skip) ? +query.skip : 0;

    const data = await this.prisma.application.findMany({
      take: take + 1,
      skip,
      where: {
        student: {
          partner_id,
        },
      },
      select: {
        id: true,
        name: true,
        level: true,
        intake: true,
        status: true,
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        course: {
          select: {
            id: true,
            university: {
              select: {
                id: true,
                university_name: true,
                country: true,
              },
            },
          },
        },
      },
    });

    return { data: Paginate(data, skip, take) };
  }
}
