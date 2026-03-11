import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadService } from '../upload/upload.service';
import { User } from '../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * GET /api/profile — get current user's profile
   */
  @Get()
  getProfile(@CurrentUser() user: User) {
    return this.profileService.getProfile(user.id);
  }

  /**
   * PATCH /api/profile — update profile fields (name, phone, about)
   */
  @Patch()
  updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.id, dto);
  }

  /**
   * POST /api/profile/avatar — upload a new avatar image
   */
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new BadRequestException('只接受圖片檔案'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('請上傳圖片');
    }
    const url = await this.uploadService.upload(file, 'avatars');
    return this.profileService.updateAvatar(user.id, url);
  }
}
