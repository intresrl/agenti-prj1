import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '@food-cost/shared/types';
import { IngredientEntity } from './entities/ingredient.entity';
import { PriceHistoryEntity } from './entities/price-history.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepo: Repository<IngredientEntity>,
    @InjectRepository(PriceHistoryEntity)
    private readonly priceHistoryRepo: Repository<PriceHistoryEntity>
  ) {}

  /**
   * AC2: Normalize raw package price to base unit price (Price/Kg or Price/L).
   * For unit=PZ or when no unitSize is given, the price is stored as-is.
   */
  private normalizePrice(price: number, unit: Unit, unitSize?: number | null): number {
    if (unit === Unit.PZ || !unitSize || unitSize <= 0) {
      return price;
    }
    return price / unitSize;
  }

  findAll(tenantId: string): Promise<IngredientEntity[]> {
    return this.ingredientRepo.find({ where: { tenantId } });
  }

  async findOne(id: string, tenantId: string): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepo.findOne({
      where: { id, tenantId },
    });
    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }
    return ingredient;
  }

  async create(dto: CreateIngredientDto, tenantId: string): Promise<IngredientEntity> {
    const normalizedPrice = this.normalizePrice(dto.price, dto.unit, dto.unitSize);
    const ingredient = this.ingredientRepo.create({
      ...dto,
      tenantId,
      price: normalizedPrice,
      unitSize: dto.unitSize ?? null,
    });
    return this.ingredientRepo.save(ingredient);
  }

  async update(
    id: string,
    dto: UpdateIngredientDto,
    tenantId: string,
    userId: string
  ): Promise<IngredientEntity> {
    const ingredient = await this.findOne(id, tenantId);

    // AC3: Price changed — persist old price in PriceHistory before update
    if (dto.price !== undefined && dto.price !== ingredient.price) {
      const history = this.priceHistoryRepo.create({
        ingredientId: ingredient.id,
        price: ingredient.price,
        changedBy: userId,
      });
      await this.priceHistoryRepo.save(history);
    }

    // Determine new normalized price
    if (dto.price !== undefined) {
      const newUnit = dto.unit ?? ingredient.unit;
      const newUnitSize = dto.unitSize ?? ingredient.unitSize ?? undefined;
      dto.price = this.normalizePrice(dto.price, newUnit, newUnitSize);
    }

    Object.assign(ingredient, dto);
    return this.ingredientRepo.save(ingredient);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const ingredient = await this.findOne(id, tenantId);
    await this.ingredientRepo.remove(ingredient);
  }
}
