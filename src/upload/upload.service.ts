import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly config: ConfigService) {
    const accountId = config.get<string>('R2_ACCOUNT_ID', '');

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.get<string>('R2_ACCESS_KEY_ID', ''),
        secretAccessKey: config.get<string>('R2_SECRET_ACCESS_KEY', ''),
      },
    });

    this.bucket = config.get<string>('R2_BUCKET_NAME', '');
    this.publicUrl = config.get<string>('R2_PUBLIC_URL', '');
  }

  /**
   * Upload a file to R2 and return its public URL.
   * @param file - Multer file object
   * @param folder - Optional subfolder (e.g. 'listings', 'avatars')
   */
  async upload(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<string> {
    const ext = path.extname(file.originalname) || '.jpg';
    const key = `${folder}/${uuid()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `${this.publicUrl}/${key}`;
    this.logger.log(`Uploaded ${key} (${file.size} bytes)`);
    return url;
  }

  /**
   * Delete a file from R2 by its public URL.
   */
  async delete(fileUrl: string): Promise<void> {
    const key = fileUrl.replace(`${this.publicUrl}/`, '');
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    this.logger.log(`Deleted ${key}`);
  }
}
