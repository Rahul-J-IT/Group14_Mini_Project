import {
  Controller, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { CurriculumService } from './curriculum.service';
import { CreateModuleDto, CreateLessonDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller()
export class CurriculumController {
  constructor(private readonly service: CurriculumService) {}

  // POST /api/courses/:courseId/modules
  @Post('courses/:courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  addModule(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.service.addModule(courseId, dto);
  }

  // PATCH /api/modules/:moduleId
  @Patch('modules/:moduleId')
  updateModule(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.service.updateModule(moduleId, dto);
  }

  // DELETE /api/modules/:moduleId
  @Delete('modules/:moduleId')
  removeModule(@Param('moduleId', ParseUUIDPipe) moduleId: string) {
    return this.service.removeModule(moduleId);
  }

  // POST /api/modules/:moduleId/lessons
  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  addLesson(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.service.addLesson(moduleId, dto);
  }

  // PATCH /api/lessons/:lessonId
  @Patch('lessons/:lessonId')
  updateLesson(
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.service.updateLesson(lessonId, dto);
  }

  // DELETE /api/lessons/:lessonId
  @Delete('lessons/:lessonId')
  removeLesson(@Param('lessonId', ParseUUIDPipe) lessonId: string) {
    return this.service.removeLesson(lessonId);
  }
}
