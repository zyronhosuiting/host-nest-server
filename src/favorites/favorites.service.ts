import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
  ) {}

  /**
   * Toggle favorite: if it exists → remove, else → create.
   * Returns { favorited: boolean }.
   */
  async toggle(
    userId: number,
    listingId: number,
  ): Promise<{ favorited: boolean }> {
    const existing = await this.repo.findOne({
      where: { userId, listingId },
    });

    if (existing) {
      await this.repo.remove(existing);
      return { favorited: false };
    }

    const fav = this.repo.create({ userId, listingId });
    await this.repo.save(fav);
    return { favorited: true };
  }

  /**
   * Get all favorites for a user, with the listing relation loaded.
   */
  async findAllByUser(userId: number): Promise<Favorite[]> {
    return this.repo.find({
      where: { userId },
      relations: ['listing'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Check if a specific listing is favorited by a user.
   */
  async isFavorited(userId: number, listingId: number): Promise<boolean> {
    const count = await this.repo.count({ where: { userId, listingId } });
    return count > 0;
  }

  /**
   * Get favorite status for multiple listings at once (for listing cards).
   */
  async getFavoritedIds(userId: number): Promise<number[]> {
    const favs = await this.repo.find({
      where: { userId },
      select: ['listingId'],
    });
    return favs.map((f) => f.listingId);
  }
}
