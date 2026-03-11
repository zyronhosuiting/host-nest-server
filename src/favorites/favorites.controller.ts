import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  /**
   * GET /api/favorites — list all favorited listings for current user
   */
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.favoritesService.findAllByUser(user.id);
  }

  /**
   * GET /api/favorites/ids — get just the listing IDs that are favorited
   */
  @Get('ids')
  getFavoritedIds(@CurrentUser() user: User) {
    return this.favoritesService.getFavoritedIds(user.id);
  }

  /**
   * POST /api/favorites/:listingId — toggle favorite on/off
   */
  @Post(':listingId')
  toggle(
    @CurrentUser() user: User,
    @Param('listingId', ParseIntPipe) listingId: number,
  ) {
    return this.favoritesService.toggle(user.id, listingId);
  }
}
