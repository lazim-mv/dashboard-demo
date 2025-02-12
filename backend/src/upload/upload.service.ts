import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly s3Client: S3Client | null = null;
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get('AWS_S3_REGION');
    if (!region) {
      this.logger.error('AWS_S3_REGION is not defined. S3 client will not be initialized.');
      return; // Exit if the region is missing
    }

    this.s3Client = new S3Client({
      region,
      endpoint: this.configService.get('AWS_S3_CONNECTION_ENDPOINT') ?? undefined,
    });
  }

  async onModuleInit() {
    if (!this.s3Client) {
      this.logger.warn('S3 client is not initialized. UploadService will not function.');
    }
  }

  private ensureS3Client() {
    if (!this.s3Client) {
      throw new Error('S3 client is not initialized. Please ensure AWS_S3_REGION is set.');
    }
  }

  async upload(fileName: string, file: Buffer, mimeType: string, bucketName: string) {
    this.ensureS3Client();
    try {
      await this.s3Client!.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: fileName,
          Body: file,
          ContentType: mimeType,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteFile(url: string) {
    this.ensureS3Client();
    try {
      const split = url.split('/');
      await this.s3Client!.send(
        new DeleteObjectCommand({
          Bucket: 'stefurn',
          Key: split[split.length - 1],
        }),
      );
    } catch (err) {
      throw err;
    }
  }

  async getPresignedURL(bucket: string, objectKey: string) {
    this.ensureS3Client();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    });
    const url = await getSignedUrl(this.s3Client!, command, {
      expiresIn: 10 * 60 * 60, // 10 hours
    });
    return url;
  }
}
