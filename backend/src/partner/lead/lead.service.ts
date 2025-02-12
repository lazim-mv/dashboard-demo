import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeadDto, CreateLeadFromAdminDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from '@prisma/client';
import { Paginate } from 'src/paginator/paginator';

@Injectable()
export class LeadService {
  constructor(private readonly prisma: PrismaService) {}

  async createLeadSource(name: string) {
    const data = await this.prisma.leadSource.create({ data: { name } });
    return { message: 'Source created!', data };
  }

  async getLeadSources() {
    const data = await this.prisma.leadSource.findMany({
      orderBy: { name: 'asc' },
    });
    return { data };
  }

  async createLead(body: CreateLeadDto) {
    await this.prisma.lead.create({
      select: { id: true },
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        phone_no: body.phone_no,
      },
    });
    return { message: 'Lead created!' };
  }

  async createLeadFromAdmin(body: CreateLeadFromAdminDto) {
    const data = await this.prisma.lead.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
        phone_no: body.phone_no,
        source_id: body.source_id,
      },
    });
    return { message: 'Lead created!', data };
  }

  async getAllLeads(query: LeadQueryDto) {
    const take = !isNaN(+query.take) ? +query.take : 10;
    const skip = !isNaN(+query.skip) ? +query.skip : 0;

    const data = await this.prisma.lead.findMany({
      skip,
      take: take + 1,
      where: {
        lead_status: query.lead_status ?? undefined,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return Paginate(data, skip, take);
  }

  async getById(id: number) {
    const data = await this.prisma.lead.findUnique({
      where: {
        id,
      },
    });
    return { data };
  }

  async updateLeadStatus(id: number, newStatus: LeadStatus) {
    await this.prisma.lead.update({
      data: { lead_status: newStatus },
      where: { id },
    });
    return { message: `Lead status updated to ${newStatus}.` };
  }

  async updateLead(id: number, body: UpdateLeadDto) {
    try {
      const data = await this.prisma.lead.update({
        where: { id },
        data: {
          name: body.name,
          phone_no: body.phone_no,
          email: body.email,
          company: body.company,
          source_id: body.source_id,
        },
      });
      return { data, message: 'Lead Updated!' };
    } catch (err) {
      console.log(err);
      if (!(err instanceof PrismaClientKnownRequestError)) {
        throw new InternalServerErrorException(
          'Something went wrong, try again.',
        );
      }
      if (err.code === 'P2025') throw new NotFoundException('Lead not found!');
      throw new InternalServerErrorException(
        'Something went wrong, try again.',
      );
    }
  }
}
