import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TenantEntity } from './auth/entities/tenant.entity';
import { UserEntity } from './auth/entities/user.entity';
import { IngredientsModule } from './ingredients/ingredients.module';
import { IngredientEntity } from './ingredients/entities/ingredient.entity';
import { PriceHistoryEntity } from './ingredients/entities/price-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'] || 'localhost',
      port: parseInt(process.env['DB_PORT'] || '5432'),
      username: process.env['DB_USER'] || 'postgres',
      password: process.env['DB_PASSWORD'] || 'postgres',
      database: process.env['DB_NAME'] || 'foodcost',
      entities: [TenantEntity, UserEntity, IngredientEntity, PriceHistoryEntity],
      synchronize: process.env['NODE_ENV'] !== 'production',
      logging: process.env['NODE_ENV'] !== 'production',
    }),
    AuthModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
