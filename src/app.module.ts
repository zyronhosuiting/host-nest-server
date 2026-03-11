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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_DATABASE', 'host_living'),
        entities: [
          User,
          Listing,
          Favorite,
          Conversation,
          Message,
          RentalTransaction,
          SchoolNet,
          Category,
        ],
        synchronize: true, // Auto-sync schema in development (disable in production)
        logging: false,
      }),
    }),

    SeedModule,
    AuthModule,
    UploadModule,
    ListingsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
