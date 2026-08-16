import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProjectCategory {
  PAINT = 'Paint',
  RESTORATION = 'Restoration',
  DETAILING = 'Detailing',
  MECHANICAL = 'Mechanical',
  ACCESSORIES = 'Accessories',
}

@Entity('projects')
@Index(['position'])
@Index(['is_active'])
@Index(['category'])
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** e.g. "Toyota Corolla Fielder 2020 Hybrid" */
  @Column({ type: 'varchar', length: 255 })
  vehicle: string;

  /** e.g. "Professional Polishing & Detailing" */
  @Column({ type: 'varchar', length: 255 })
  work: string;

  /** e.g. "Mirror-finish shine restored and protected for the long haul." */
  @Column({ type: 'text' })
  result: string;

  @Column({ type: 'enum', enum: ProjectCategory })
  category: ProjectCategory;

  /** Project photo (uploaded via multipart form) */
  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'int', default: 1 })
  position: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'uuid' })
  added_by: string;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'added_by' })
  addedBy: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at?: Date;
}
