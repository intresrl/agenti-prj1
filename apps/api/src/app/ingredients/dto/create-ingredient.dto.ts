import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { Unit } from '@food-cost/shared/types';

export class CreateIngredientDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  category?: string;

  /** Raw price as entered (e.g. price per package/bottle) */
  @IsNumber()
  @IsPositive()
  price!: number;

  @IsEnum(Unit)
  unit!: Unit;

  /** Package size in base unit, e.g. 0.75 for a 0.75 L bottle */
  @IsNumber()
  @IsPositive()
  @IsOptional()
  unitSize?: number;
}
