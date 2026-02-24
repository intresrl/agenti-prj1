import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { Unit } from '@food-cost/shared/types';

export class UpdateIngredientDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsEnum(Unit)
  @IsOptional()
  unit?: Unit;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  unitSize?: number;
}
