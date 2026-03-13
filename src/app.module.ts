import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Listing } from './entities/listing.entity';
import { Favorite } from './entities/favorite.entity';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { RentalTransaction } from './entities/rental-transaction.entity';
import { SchoolNet } from './entities/school-net.entity';
import { Category } from './entities/category.entity';

import { SeedModule } from './seed/seed.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { ListingsModule } from './listings/listings.module';
import { CategoriesModule } from './categories/categories.module';
import { FavoritesModule } from './favorites/favorites.module';
import { MessagesModule } from './messages/messages.module';
import { ProfileModule } from './profile/profile.module';
import { ReferenceDataModule } from './reference-data/reference-data.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        // Railway / production: use DATABASE_URL connection string
        if (databaseUrl) {
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [
              User, Listing, Favorite, Conversation, Message,
              RentalTransaction, SchoolNet, Category,
            ],
            ssl: { rejectUnauthorized: false },
            synchronize: true,
            logging: false,
          };
        }

        // Local development: use individual env vars
        return {
          type: 'postgres' as const,
          host: config.get<string>('DB_HOST', 'localhost'),
          port: config.get<number>('DB_PORT', 5432),
          username: config.get<string>('DB_USERNAME', 'postgres'),
          password: config.get<string>('DB_PASSWORD', 'postgres'),
          database: config.get<string>('DB_DATABASE', 'host_living'),
          entities: [
            User, Listing, Favorite, Conversation, Message,
            RentalTransaction, SchoolNet, Category,
          ],
          synchronize: true,
          logging: false,
        };
      },
    }),

    SeedModule,
    AuthModule,
    UploadModule,
    ListingsModule,
    CategoriesModule,
    FavoritesModule,
    MessagesModule,
    ProfileModule,
    ReferenceDataModule,
  ],
})
export class AppModule {}
