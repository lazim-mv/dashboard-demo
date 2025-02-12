import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { generateRandomString, getFileExtension } from '../utils/utilities';
import { FilesInterceptor, File } from '@nest-lab/fastify-multer';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: File[]) {
    //validation for files
    files.forEach((file) => {
      const validFileType = /(image\/jpeg|image\/jpg|image\/png)$/.test(
        file.mimetype,
      );
      const validFileSize = file.size <= 1000000;
      if (!validFileType || !validFileSize) {
        throw new UnprocessableEntityException('Invalid file type or size');
      }
    });
    const uploadedURLs = [];
    for (const file of files) {
      const filename =
        generateRandomString(10) + getFileExtension(file.originalname);
      await this.uploadService.upload(
        filename,
        file.buffer,
        file.mimetype,
        this.configService.getOrThrow('PUBLIC_DOC_BUCKET'),
      );

      uploadedURLs.push(
        `${process.env.SUPABASE_AWS_S3_PUBLIC_ACCESS_URL}/${filename}`,
      );
    }

    return {
      objectURLs: uploadedURLs,
    };
  }

  // @Post('file')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({
  //         fileType: /(image\/jpeg|image\/png)$/,
  //       })

  //       .addMaxSizeValidator({
  //         maxSize: 1000000,
  //       })

  //       .build({
  //         errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  //       }),
  //   )
  //   file: any,
  // ) {
  //   // console.log(file);
  //   // const filename = uuidv4();
  //   const filename =
  //     generateRandomString(10) + getFileExtension(file.originalname);
  //   await this.uploadService.upload(filename, file.buffer);
  //   return {
  //     objectURL: `https://stefurn.s3.amazonaws.com/${filename}`,
  //   };
  // }
  @Delete()
  async deleteFile(@Body() body: { url: string }) {
    await this.uploadService.deleteFile(body.url);
    return {
      message: 'File deleted successfully',
    };
  }
}
