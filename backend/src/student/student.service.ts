import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddEmergencyContactDto,
  CreateStudentDto,
  StudentAddressDto,
  UpdateStudentDto,
} from './dto/create-student.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
import { UploadService } from 'src/upload/upload.service';
import { ConfigService } from '@nestjs/config';
import { File } from '@nest-lab/fastify-multer';
import { StudentDocumentDto } from './dto/student-document.dto';
import { NextTabDto, StudentTabStatusEnum } from './dto/next-tab.dto';
import { StudentDocuments, Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  async nextTab(partner_id: number, id: number, body: NextTabDto) {
    const commentList = {
      personal_details:
        body.tab_status === StudentTabStatusEnum.PERSONAL_DETAILS
          ? body.comment
          : undefined,
      education:
        body.tab_status === StudentTabStatusEnum.EDUCATION
          ? body.comment
          : undefined,
      travel_immigration:
        body.tab_status === StudentTabStatusEnum.TRAVEL_IMMIGRATION
          ? body.comment
          : undefined,
      referee:
        body.tab_status === StudentTabStatusEnum.REFEREE_DETAILS
          ? body.comment
          : undefined,
      work_details:
        body.tab_status === StudentTabStatusEnum.WORK_DETAILS
          ? body.comment
          : undefined,
      document:
        body.tab_status === StudentTabStatusEnum.DOCUMENTS
          ? body.comment
          : undefined,
      shortlist:
        body.tab_status === StudentTabStatusEnum.SHORT_LIST_APPLY
          ? body.comment
          : undefined,
      application:
        body.tab_status === StudentTabStatusEnum.APPLICATIONS
          ? body.comment
          : undefined,
    };
    try {
      await this.prisma.student.update({
        where: {
          partner_id,
          id,
        },
        data: {
          tab_status: body.tab_status,
          comment: commentList.personal_details,
          work_details_comments: commentList.work_details,
          referee_details_comments: commentList.referee,
          shortlist_comment: commentList.shortlist,
          application_comment: commentList.application,
          travel_immigration: commentList.travel_immigration
            ? {
                update: {
                  comment: commentList.travel_immigration,
                },
              }
            : undefined,
          education: commentList.education
            ? {
                update: {
                  comment: commentList.education,
                },
              }
            : undefined,
          document: commentList.document
            ? {
                update: {
                  comment: commentList.document,
                },
              }
            : undefined,
        },
      });
      return { message: 'Tab status updated.' };
    } catch (err) {
      console.log(err);
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      if (
        ['StudentDocuments', 'StudentEducation', 'TravelImmigration'].some(
          (str) => err.message.includes(str),
        )
      ) {
        throw new BadRequestException('Marking uncompleted tab as completed.');
      }
      throw new NotFoundException('Student not found');
    }
  }

  async create(partner_id: number, body: CreateStudentDto) {
    const data = await this.prisma.student.create({
      data: {
        partner_id,
        name: body.name,
        status: body.status,
        surname: body.surname,
        email: body.email,
        phone_no: body.phone_no,
        dob: body.dob,
        gender: body.gender,
        nationality: body.nationality,
        birth_country: body.birth_country,
        native_language: body.native_language,
        passport_issue_location: body.passport_issue_location,
        passport_number: body.passport_number,
        issue_date: body.issue_date,
        expiry_date: body.expiry_date,
        skype_id: body.skype_id,
        alternate_phone_no: body.alternate_phone_no,
      },
    });
    return { data };
  }

  async updatePersonalDetails(
    partner_id: number,
    id: number,
    body: UpdateStudentDto,
  ) {
    try {
      await this.prisma.student.update({
        where: {
          partner_id,
          id,
        },
        data: {
          partner_id,
          name: body.name,
          status: body.status,
          surname: body.surname,
          email: body.email,
          phone_no: body.phone_no,
          dob: body.dob,
          gender: body.gender,
          nationality: body.nationality,
          birth_country: body.birth_country,
          native_language: body.native_language,
          passport_issue_location: body.passport_issue_location,
          passport_number: body.passport_number,
          issue_date: body.issue_date,
          expiry_date: body.expiry_date,
          skype_id: body.skype_id,
          alternate_phone_no: body.alternate_phone_no,
        },
      });
      return { message: 'Personal details updated.' };
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

  async findAll(partner_id: number) {
    try {
      const data = await this.prisma.student.findMany({
        include: {
          partner: true,
        },
        where: {
          partner_id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      if (data.length === 0) {
        throw new NotFoundException('Students not found.');
      }
      return { data };
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

  async findById(partner_id: number, id: number) {
    try {
      const data = await this.prisma.student.findUnique({
        include: {
          partner: true,
          current_address: true,
          permanent_address: true,
          education: {
            include: {
              academic_history: true,
              academic_interest: true,
              proficient_languages: true,
            },
          },
          travel_immigration: true,
          work_details: true,
          referee_details: true,
          document: true,
          course_shortlist: {
            include: {
              course: {
                include: {
                  university: true,
                },
              },
            },
          },
          applications: {
            include: {
              course: {
                include: {
                  university: true,
                },
              },
            },
          },
        },
        where: {
          partner_id,
          id,
        },
      });
      if (!data) {
        throw new NotFoundException('Student not found.');
      }
      return { data };
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

  async addAddress(
    partner_id: number,
    id: number,
    body: StudentAddressDto,
    mode: 'PERMANENT' | null = null,
  ) {
    const data = await this.prisma.student.update({
      select: {
        permanent_address: mode === 'PERMANENT' ? true : false,
        current_address: mode === null ? true : false,
      },
      where: {
        id,
        partner_id,
      },
      data: {
        permanent_address:
          mode === 'PERMANENT'
            ? {
                upsert: {
                  create: {
                    city: body.city,
                    post_code: body.post_code,
                    country: body.country,
                    address1: body.address1,
                    address2: body.address2,
                    state: body.state,
                  },
                  update: {
                    city: body.city,
                    post_code: body.post_code,
                    country: body.country,
                    address1: body.address1,
                    address2: body.address2,
                    state: body.state,
                  },
                },
              }
            : undefined,
        current_address:
          mode === null
            ? {
                upsert: {
                  create: {
                    city: body.city,
                    post_code: body.post_code,
                    country: body.country,
                    address1: body.address1,
                    address2: body.address2,
                    state: body.state,
                  },
                  update: {
                    city: body.city,
                    post_code: body.post_code,
                    country: body.country,
                    address1: body.address1,
                    address2: body.address2,
                    state: body.state,
                  },
                },
              }
            : undefined,
      },
    });
    return { data };
  }

  async addEmergencyContact(
    partnerId: number,
    id: number,
    body: AddEmergencyContactDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        where: { id, partner_id: partnerId },
        data: {
          comment: body.comment,
          emergency_contact_no: body.emergency_contact_no,
          emergency_contact_name: body.emergency_contact_name,
          emergency_contact_email: body.emergency_contact_email,
          emergency_contact_address: body.emergency_contact_relation,
          emergency_contact_relation: body.emergency_contact_relation,
        },
      });
      return { data };
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

  async addCompletedEducation(
    partner_id: number,
    id: number,
    body: AddCompletedEducationDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          education: {
            select: {
              academic_history: true,
            },
          },
        },
        where: {
          id,
          partner_id,
        },
        data: {
          education: {
            upsert: {
              create: {
                academic_history: {
                  createMany: {
                    data: body.data.map((history) => ({
                      country: history.country,
                      institution: history.institution,
                      course: history.course,
                      level_of_study: history.level_of_study,
                      start_date: history.start_date,
                      end_date: history.end_date,
                      result_percent: history.result_percent,
                    })),
                  },
                },
              },
              update: {
                academic_history: {
                  createMany: {
                    data: body.data.map((history) => ({
                      country: history.country,
                      institution: history.institution,
                      course: history.course,
                      level_of_study: history.level_of_study,
                      start_date: history.start_date,
                      end_date: history.end_date,
                      result_percent: history.result_percent,
                    })),
                  },
                },
              },
            },
          },
        },
      });
      return { data: data.education.academic_history };
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

  async deleteCompletedEducation(
    partner_id: number,
    id: number,
    history_id: number,
  ) {
    try {
      await this.prisma.academicHistory.delete({
        where: {
          id: history_id,
          student_education: {
            student: {
              id,
              partner_id,
            },
          },
        },
      });
      return { message: 'Academic history deleted.' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('History not found.');
    }
  }

  async addAcademicInterest(
    partner_id: number,
    id: number,
    body: AddAcademicInterestDto,
    mode: 'CREATE' | 'UPDATE',
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          education: {
            select: {
              academic_interest: true,
            },
          },
        },
        where: {
          partner_id,
          id,
        },
        data: {
          education: {
            upsert: {
              create: {
                academic_interest:
                  mode === 'CREATE'
                    ? {
                        create: {
                          country: body.country,
                          level_of_study: body.level_of_study,
                          programme: body.programme,
                          intake: body.intake,
                          location: body.location,
                        },
                      }
                    : {
                        create: {
                          country: body.country,
                          level_of_study: body.level_of_study,
                          programme: body.programme,
                          intake: body.intake,
                          location: body.location,
                        },
                      },
              },
              update: {
                academic_interest:
                  mode === 'CREATE'
                    ? {
                        create: {
                          country: body.country,
                          level_of_study: body.level_of_study,
                          programme: body.programme,
                          intake: body.intake,
                          location: body.location,
                        },
                      }
                    : {
                        create: {
                          country: body.country,
                          level_of_study: body.level_of_study,
                          programme: body.programme,
                          intake: body.intake,
                          location: body.location,
                        },
                      },
              },
            },
          },
        },
      });
      return { data: data.education.academic_interest };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async addLanguage(partner_id: number, id: number, body: AddLanguagesDto) {
    try {
      const data = await this.prisma.student.update({
        select: {
          education: {
            select: {
              proficient_languages: true,
            },
          },
        },
        where: {
          partner_id,
          id,
        },
        data: {
          education: {
            update: {
              proficient_languages: {
                createMany: {
                  data: body.languages.map((lang) => ({
                    name: lang.name,
                    level_of_proficiencey: lang.level_of_proficiencey,
                    years_of_experience: lang.years_of_experience,
                  })),
                },
              },
            },
          },
        },
      });
      return { data: data.education.proficient_languages };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async deleteLanguage(partner_id: number, id: number, lang_id: number) {
    try {
      await this.prisma.language.delete({
        where: {
          id: lang_id,
          StudentEducation: {
            student: {
              partner_id,
              id,
            },
          },
        },
      });
      return { message: 'Language deleted.' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async addTravelHistory(
    partner_id: number,
    id: number,
    body: AddTravelHistoryDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          travel_immigration: true,
        },
        where: {
          partner_id,
          id,
        },
        data: {
          travel_immigration: {
            upsert: {
              create: {
                need_visa_for_specific_countries:
                  body.need_visa_for_specific_countries,
                stay_permission_in_specific_countries:
                  body.applied_for_stay_permission,
              },
              update: {
                need_visa_for_specific_countries:
                  body.need_visa_for_specific_countries,
                stay_permission_in_specific_countries:
                  body.applied_for_stay_permission,
              },
            },
          },
        },
      });
      return { data: data.travel_immigration };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async addVisaHealthInfo(
    partner_id: number,
    id: number,
    body: AddVisaHealthInfoDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          travel_immigration: true,
        },
        where: {
          partner_id,
          id,
        },
        data: {
          travel_immigration: {
            upsert: {
              create: {
                visa_rejections_for_any_countries: body.visa_rejections,
                has_health_issues: body.health_issue,
                health_issue_details: body.health_issue_details,
              },
              update: {
                visa_rejections_for_any_countries: body.visa_rejections,
                has_health_issues: body.health_issue,
                health_issue_details: body.health_issue_details,
              },
            },
          },
        },
      });
      return {
        data: data.travel_immigration,
      };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async addRefereeDetails(
    partner_id: number,
    id: number,
    body: AddRefereeDetailsDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          referee_details: true,
        },
        where: {
          partner_id,
          id,
        },
        data: {
          referee_details: {
            createMany: {
              data: body.referee_details.map((referee) => {
                return {
                  name: referee.name,
                  email: referee.email,
                  address: referee.address,
                  position: referee.position,
                  mobile_no: referee.mobile_no,
                };
              }),
            },
          },
        },
      });
      return { data: data.referee_details };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async removeRefereeDetails(
    partner_id: number,
    id: number,
    referee_id: number,
  ) {
    try {
      await this.prisma.refereeDetails.delete({
        where: {
          id: referee_id,
          student: {
            partner_id,
            id,
          },
        },
      });
      return { message: 'Referee removed' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Referee not found.');
    }
  }

  async addWorkDetails(
    partner_id: number,
    id: number,
    body: AddWorkDetailsDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          work_details: true,
        },
        where: {
          partner_id,
          id,
        },
        data: {
          work_details: {
            createMany: {
              data: body.work_details.map((work) => {
                return {
                  title: work.title,
                  organisation: work.organisation,
                  organisation_address: work.organisation_address,
                  phone_no: work.phone_no,
                  email: work.email,
                  from_date: work.from_date,
                  to_date: work.to_date,
                };
              }),
            },
          },
        },
      });
      return { data: data.work_details };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async removeWorkDetails(
    partner_id: number,
    id: number,
    work_details_id: number,
  ) {
    try {
      await this.prisma.workDetails.delete({
        where: {
          id: work_details_id,
          student: {
            partner_id,
            id,
          },
        },
      });
      return { message: 'Work experience deleted' };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async upload(
    partner_id: number,
    id: number,
    fileName: keyof StudentDocuments,
    file: File,
  ) {
    if (['updated_at', 'created_at', 'comment'].includes(fileName)) {
      throw new BadRequestException('Invalid doc');
    }

    try {
      const student = await this.prisma.student.findUnique({
        where: { partner_id, id },
      });
      if (!student) {
        throw new NotFoundException('Student not found.');
      }

      const filePath = `${id}/${fileName}.${file.mimetype.split('/')[1]}`;
      await this.uploadService.upload(
        filePath,
        file.buffer,
        file.mimetype,
        this.configService.getOrThrow('STUDENT_DOC_BUCKET'),
      );

      const studentDocumentCreate: Prisma.StudentDocumentsCreateWithoutStudentInput =
        {
          [fileName as typeof fileName]: filePath,
        };
      await this.prisma.student.update({
        where: {
          partner_id,
          id,
        },
        data: {
          document: {
            upsert: {
              create: studentDocumentCreate,
              update: studentDocumentCreate,
            },
          },
        },
      });
      return { message: 'File uploaded', file_path: filePath };
    } catch (err) {
      throw new InternalServerErrorException('Upload failed, try again.');
    }
  }

  async getStudentDocUrls(partner_id: number, id: number) {
    try {
      const student = await this.prisma.student.findUnique({
        select: {
          document: true,
        },
        where: {
          partner_id,
          id,
        },
      });
      const docs = student.document;
      if (!docs) {
        throw new NotFoundException('Docs not uploaded');
      }
      const docNames = Object.keys(docs).filter((key) => docs[key]);
      const resolvedDocs = await Promise.allSettled(
        docNames.map((doc) => {
          return this.uploadService.getPresignedURL(
            this.configService.getOrThrow('STUDENT_DOC_BUCKET'),
            docs[doc],
          );
        }),
      );
      const docUrl: Partial<typeof docs> = {};
      resolvedDocs.forEach((url, i) => {
        if (url.status === 'fulfilled') {
          docUrl[docNames[i]] = url.value;
        }
      });

      return {
        data: docUrl,
      };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }

  async setStudentDocPath(
    partner_id: number,
    id: number,
    body: StudentDocumentDto,
  ) {
    try {
      const data = await this.prisma.student.update({
        select: {
          document: true,
        },
        where: {
          partner_id,
          id,
        },
        data: {
          document: {
            upsert: {
              create: {
                photo: body.photo,
                passport: body.passport,
                pg: body.pg,
                pg_marksheet: body.pg_marksheet,
                ug: body.ug,
                ug_marksheet: body.ug_marksheet,
                higher_sec: body.higher_sec,
                tenth: body.tenth,
                lor: body.lor,
                moi: body.moi,
                cv: body.cv,
                exp_cert: body.exp_cert,
                sop: body.sop,
                other_diploma_cert: body.other_diploma_cert,
                others: body.others,
              },
              update: {
                photo: body.photo,
                passport: body.passport,
                pg: body.pg,
                pg_marksheet: body.pg_marksheet,
                ug: body.ug,
                ug_marksheet: body.ug_marksheet,
                higher_sec: body.higher_sec,
                tenth: body.tenth,
                lor: body.lor,
                moi: body.moi,
                cv: body.cv,
                exp_cert: body.exp_cert,
                sop: body.sop,
                other_diploma_cert: body.other_diploma_cert,
                others: body.others,
              },
            },
          },
        },
      });
      return { documents: data.document };
    } catch (err) {
      if (
        !(err instanceof PrismaClientKnownRequestError) ||
        err.code !== 'P2025'
      ) {
        throw err;
      }
      throw new NotFoundException('Student not found.');
    }
  }
}
