import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CurriculumModule as CurriculumModuleEntity } from '../curriculum/entities/curriculum-module.entity';
import { Lesson } from '../curriculum/entities/lesson.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Tag, CurriculumModuleEntity, Lesson])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
