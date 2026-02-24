import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IngredientEntity } from './ingredient.entity';

@Entity('price_history')
export class PriceHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ingredientId!: string;

  @ManyToOne(() => IngredientEntity, (ingredient) => ingredient.priceHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredientId' })
  ingredient!: IngredientEntity;

  /** The OLD price stored before the update */
  @Column('decimal', { precision: 10, scale: 4 })
  price!: number;

  @Column()
  changedBy!: string;

  @CreateDateColumn()
  changedAt!: Date;
}
