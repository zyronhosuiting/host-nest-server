import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('找不到用戶');
    }

    // Return safe fields (exclude passwordHash)
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      phone: user.phone,
      about: user.about,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('找不到用戶');
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.about !== undefined) user.about = dto.about;

    await this.userRepo.save(user);
    return this.getProfile(userId);
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('找不到用戶');
    }
    user.avatarUrl = avatarUrl;
    await this.userRepo.save(user);
    return { avatarUrl };
  }
}
