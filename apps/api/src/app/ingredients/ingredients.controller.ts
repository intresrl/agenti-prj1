import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { TenantGuard } from '../auth/guards/tenant.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserEntity } from '../auth/entities/user.entity';
import { UserRole } from '@food-cost/shared/types';
import { IngredientEntity } from './entities/ingredient.entity';

/**
 * All endpoints are protected by TenantGuard (AC2 - Story 1.2).
 * Write operations are restricted to ADMIN role (AC3 - Story 1.2 / Business Rule 4).
 */
@Controller('ingredients')
@UseGuards(TenantGuard, RolesGuard)
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  findAll(@CurrentUser() user: UserEntity): Promise<IngredientEntity[]> {
    return this.ingredientsService.findAll(user.tenantId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity
  ): Promise<IngredientEntity> {
    return this.ingredientsService.findOne(id, user.tenantId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body() dto: CreateIngredientDto,
    @CurrentUser() user: UserEntity
  ): Promise<IngredientEntity> {
    return this.ingredientsService.create(dto, user.tenantId);
  }

  /** AC3: Updating price triggers a PriceChangeEvent stored in PriceHistory */
  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateIngredientDto,
    @CurrentUser() user: UserEntity
  ): Promise<IngredientEntity> {
    return this.ingredientsService.update(id, dto, user.tenantId, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity
  ): Promise<void> {
    return this.ingredientsService.remove(id, user.tenantId);
  }
}
