import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { Paginate } from 'src/paginator/paginator';
import { PartnerQueryDto } from './dto/partner-query.dto';
import * as bcrypt from 'bcrypt';
import { PARTNER_SUPER_ADMIN_ROLE } from './entity/partner.entity';
import { UploadService } from 'src/upload/upload.service';
import { ConfigService } from '@nestjs/config';
import { File } from '@nest-lab/fastify-multer';
import { UpdatePartnerStatusDto } from './dto/update-partner-status.dto';
import { PartnerStatusEnum } from './entity/enums';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PartnerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  async canCreatePartner(uuid: string) {
    const lead = await this.prisma.lead.findUnique({
      select: { partner: true },
      where: { url_id: uuid },
    });
    if (!lead || lead.partner) throw new NotFoundException();
    return { message: 'You can fill in this form to register as a partner.' };
  }

  async createPartner(uuid: string, body: CreatePartnerDto) {
    if (!uuid) throw new BadRequestException();
    const lead = await this.prisma.lead.findUnique({
      include: { partner: true },
      where: { url_id: uuid },
    });
    if (!lead) {
      throw new ForbiddenException("You don't have access to this resource.");
    }
    if (lead.partner) {
      throw new BadRequestException('You have already submitted this form.');
    }

    await this.prisma.$transaction(async (tx) => {
      const partner = await tx.partner.create({
        select: { id: true, users: true },
        data: {
          email: body.email,
          first_name: body.first_name,
          last_name: body.last_name,
          mobile_no: body.mobile_no,
          whatsapp_no: body.whatsapp_no,
          company_name: body.company_name,
          website: body.website,
          address: body.address,
          city: body.city,
          post_code: body.post_code,
          country: body.country,
          lead: { connect: { url_id: uuid } },
          users: {
            create: {
              name: body.company_name,
              email: body.email,
              password: await bcrypt.hash(body.password, 10),
              parent_role: 'PARTNER_ADMIN',
            },
          },
        },
      });
      await tx.role.create({
        data: {
          name: PARTNER_SUPER_ADMIN_ROLE,
          partner: { connect: { id: partner.id } },
          UserRole: { create: { user_id: partner.users[0].id } },
        },
      });
    });

    return { message: 'Partner Data Submitted.' };
  }

  async getAllPartners(query: PartnerQueryDto) {
    const skip = +query.skip;
    const take = +query.take;

    const data = await this.prisma.partner.findMany({
      skip,
      take: take + 1,
    });
    return Paginate(data, skip, take);
  }

  async getPartnerById(id: number) {
    const data = await this.prisma.partner.findUnique({
      where: {
        id,
      },
    });
    if (!data) {
      throw new NotFoundException('Partner not found.');
    }
    return { data };
  }

  async updatePartner(id: number, body: UpdatePartnerDto) {
    try {
      const partner = await this.prisma.partner.findUnique({
        select: {
          users: {
            where: {
              user_roles: {
                some: {
                  role: {
                    name: PARTNER_SUPER_ADMIN_ROLE,
                  },
                },
              },
            },
          },
        },
        where: {
          id,
        },
      });
      if (!partner) {
        throw new NotFoundException('Partner not found.');
      }
      if (partner.users.length !== 1) {
        throw new InternalServerErrorException('Partner user error.');
      }
      await this.prisma.partner.update({
        where: {
          id,
        },
        data: {
          email: body.email,
          first_name: body.first_name,
          last_name: body.last_name,
          mobile_no: body.mobile_no,
          whatsapp_no: body.whatsapp_no,
          company_name: body.company_name,
          website: body.website,
          address: body.address,
          city: body.city,
          post_code: body.post_code,
          country: body.country,
          users:
            body.company_name || body.email || body.password
              ? {
                  update: {
                    where: {
                      id: partner.users[0].id,
                    },
                    data: {
                      name: body.company_name,
                      email: body.email ?? undefined,
                      password: body.password
                        ? await bcrypt.hash(body.password, 10)
                        : undefined,
                    },
                  },
                }
              : undefined,
        },
      });
      return { message: 'Partner updated.' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Partner not found');
    }
  }

  async getAuthedPartner(id: number) {
    const user = await this.prisma.user.findUnique({
      select: { partner: true },
      where: { id },
    });
    if (!user.partner) throw new BadRequestException();
    return { data: user.partner };
  }

  async uploadDocs(
    partnerId: number,
    files: {
      pan_card: File[];
      cancelled_cheque: File[];
      gst_letter: File[];
    },
  ) {
    const panCardFileName = `${partnerId}_pan_card.${files.pan_card[0].originalname.split('.').at(-1)}`;
    const chequeFileName = `${partnerId}_cancelled_cheque.${files.cancelled_cheque[0].originalname.split('.').at(-1)}`;
    const gstFileName = `${partnerId}_gst_letter.${files.gst_letter[0].originalname.split('.').at(-1)}`;
    const promises = [
      this.uploadService.upload(
        panCardFileName,
        files.pan_card[0].buffer,
        files.pan_card[0].mimetype,
        this.configService.getOrThrow('PARTNER_DOC_BUCKET'),
      ),
      this.uploadService.upload(
        chequeFileName,
        files.cancelled_cheque[0].buffer,
        files.cancelled_cheque[0].mimetype,
        this.configService.getOrThrow('PARTNER_DOC_BUCKET'),
      ),
      this.uploadService.upload(
        gstFileName,
        files.gst_letter[0].buffer,
        files.gst_letter[0].mimetype,
        this.configService.getOrThrow('PARTNER_DOC_BUCKET'),
      ),
    ];
    const promiseResults = await Promise.allSettled(promises);
    const setteled = promiseResults.every((res) => res.status === 'fulfilled');
    if (!setteled) {
      throw new InternalServerErrorException(
        'Failed to upload one or more files, try again.',
      );
    }
    await this.prisma.partner.update({
      where: { id: partnerId, can_upload_docs: true },
      data: {
        can_upload_docs: false,
        pan_card_url: panCardFileName,
        cancelled_cheque_url: chequeFileName,
        gst_spice_letter_url: gstFileName,
      },
    });
    return { message: 'Document submitted for review.' };
  }

  async getDocs(partnerId: number) {
    const partner = await this.prisma.partner.findUnique({
      where: {
        id: partnerId,
      },
    });

    const urlPromises = [
      this.uploadService.getPresignedURL(
        process.env.PARTNER_DOC_BUCKET,
        partner.pan_card_url,
      ),
      this.uploadService.getPresignedURL(
        process.env.PARTNER_DOC_BUCKET,
        partner.gst_spice_letter_url,
      ),
      this.uploadService.getPresignedURL(
        process.env.PARTNER_DOC_BUCKET,
        partner.cancelled_cheque_url,
      ),
    ];

    const resolvedUrls = await Promise.allSettled(urlPromises);
    if (!resolvedUrls.every((url) => url.status === 'fulfilled')) {
      throw new InternalServerErrorException('Something went wrong try again.');
    }

    return {
      pan_card_url: resolvedUrls[0].value,
      gst_spice_letter_url: resolvedUrls[1].value,
      cancelled_cheque_url: resolvedUrls[2].value,
    };
  }

  async updatePartnerStatus(id: number, body: UpdatePartnerStatusDto) {
    await this.prisma.partner.update({
      where: {
        id,
      },
      data: {
        status: body.newStatus,
        resubmit_note: body.resubmit_note,
        can_upload_docs:
          body.newStatus === PartnerStatusEnum.RESUBMISSION ? true : false,
      },
    });
    return { message: `Partner status updated to ${body.newStatus}.` };
  }
}
