import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // POST /api/courses
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  // GET /api/courses?search=react&level=BEGINNER&page=1&limit=12
  @Get()
  findAll(@Query() query: QueryCoursesDto) {
    return this.coursesService.findAll(query);
  }

  // GET /api/courses/section/recommended
  @Get('section/:section')
  findBySection(
    @Param('section') section: string,
    @Query('limit') limit?: number,
  ) {
    return this.coursesService.findBySection(section, limit ? Number(limit) : 10);
  }

  // GET /api/courses/instructor/:instructorId
  @Get('instructor/:instructorId')
  findByInstructor(@Param('instructorId', ParseUUIDPipe) instructorId: string) {
    return this.coursesService.findByInstructor(instructorId);
  }

  // GET /api/courses/instructor/:instructorId/stats
  @Get('instructor/:instructorId/stats')
  getInstructorStats(@Param('instructorId', ParseUUIDPipe) instructorId: string) {
    return this.coursesService.getInstructorStats(instructorId);
  }

  // GET /api/courses/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  // PATCH /api/courses/:id
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, dto);
  }

  // DELETE /api/courses/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
