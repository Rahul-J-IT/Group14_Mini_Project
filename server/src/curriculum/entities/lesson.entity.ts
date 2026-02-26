import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { CurriculumModule } from './curriculum-module.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 300 })
  title: string;

  @Column({ type: 'text', nullable: true })
  video_url: string;

  @Column({ type: 'int', default: 0 })
  duration_minutes: number;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @Column({ default: false })
  is_free_preview: boolean;

  @ManyToOne(() => CurriculumModule, (module) => module.lessons, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: CurriculumModule;

  @Column()
  module_id: string;

  @CreateDateColumn()
  created_at: Date;
}
