import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  OneToMany, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Lesson } from './lesson.entity';

@Entity('curriculum_modules')
export class CurriculumModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'int', default: 0 })
  order_index: number;

  @ManyToOne(() => Course, (course) => course.curriculum, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  course_id: string;

  @OneToMany(() => Lesson, (lesson) => lesson.module, { cascade: true, eager: true })
  lessons: Lesson[];

  @CreateDateColumn()
  created_at: Date;
}
