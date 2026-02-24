import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientEntity } from './entities/ingredient.entity';
import { PriceHistoryEntity } from './entities/price-history.entity';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity, PriceHistoryEntity])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
  exports: [IngredientsService],
})
export class IngredientsModule {}
