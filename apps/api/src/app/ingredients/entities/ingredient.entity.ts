import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Unit } from '@food-cost/shared/types';
import { PriceHistoryEntity } from './price-history.entity';

@Entity('ingredients')
export class IngredientEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true, type: 'varchar' })
  category!: string | null;

  /** Normalized base unit price (Price/Kg, Price/L or Price/Pz) */
  @Column('decimal', { precision: 10, scale: 4 })
  price!: number;

  @Column({ type: 'enum', enum: Unit })
  unit!: Unit;

  /** Package size, e.g. 0.75 for a 0.75 L bottle */
  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  unitSize!: number | null;

  @OneToMany(() => PriceHistoryEntity, (history) => history.ingredient)
  priceHistory!: PriceHistoryEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
