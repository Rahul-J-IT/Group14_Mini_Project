import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { Category } from '../../categories/entities/category.entity';
import { CurriculumModule } from '../../curriculum/entities/curriculum-module.entity';
import { Tag } from '../../tags/entities/tag.entity';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 500 })
  short_description: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  thumbnail_url: string;

  @Column({ type: 'text', nullable: true })
  intro_video_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ length: 50, default: 'English' })
  language: string;

  @Column({ type: 'enum', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] })
  level: CourseLevel;

  @Column({ type: 'int', default: 0 })
  estimated_duration_minutes: number;

  @Column({ type: 'int', default: 0 })
  total_enrollments: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  average_rating: number;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ type: 'json', nullable: true })
  what_you_learn: string[];

  @Column({ type: 'json', nullable: true })
  requirements: string[];

  // Relations
  @ManyToOne(() => Instructor, (instructor) => instructor.courses, { eager: true, nullable: true })
  @JoinColumn({ name: 'instructor_id' })
  instructor: Instructor;

  @Column({ nullable: true })
  instructor_id: string;

  @ManyToOne(() => Category, (category) => category.courses, { eager: true, nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ nullable: true })
  category_id: string;

  @OneToMany(() => CurriculumModule, (module) => module.course, { cascade: true })
  curriculum: CurriculumModule[];

  @ManyToMany(() => Tag, (tag) => tag.courses, { eager: true, cascade: true })
  @JoinTable({
    name: 'course_tags',
    joinColumn: { name: 'course_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
