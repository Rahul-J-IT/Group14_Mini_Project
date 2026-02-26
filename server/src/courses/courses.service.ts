import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like, Between, FindOptionsWhere } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryCoursesDto } from './dto/query-courses.dto';
import { Tag } from '../tags/entities/tag.entity';
import { CurriculumModule } from '../curriculum/entities/curriculum-module.entity';
import { Lesson } from '../curriculum/entities/lesson.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
    @InjectRepository(CurriculumModule)
    private readonly moduleRepo: Repository<CurriculumModule>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    private readonly dataSource: DataSource,
  ) {}

  // ─── CREATE ──────────────────────────────────────────────────────────────
  async create(dto: CreateCourseDto): Promise<Course> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Resolve or create tags
      const tags: Tag[] = [];
      if (dto.tags?.length) {
        for (const name of dto.tags) {
          let tag = await this.tagRepo.findOne({ where: { name } });
          if (!tag) {
            tag = this.tagRepo.create({ name });
            tag = await queryRunner.manager.save(Tag, tag);
          }
          tags.push(tag);
        }
      }

      // Build course
      const course = queryRunner.manager.create(Course, {
        title: dto.title,
        short_description: dto.short_description,
        description: dto.description,
        thumbnail_url: dto.thumbnail_url,
        intro_video_url: dto.intro_video_url,
        price: dto.price ?? 0,
        language: dto.language ?? 'English',
        level: dto.level,
        estimated_duration_minutes: dto.estimated_duration_minutes ?? 0,
        is_featured: dto.is_featured ?? false,
        what_you_learn: dto.what_you_learn ?? [],
        requirements: dto.requirements ?? [],
        instructor_id: dto.instructor_id,
        category_id: dto.category_id,
        tags,
      });

      const savedCourse = await queryRunner.manager.save(Course, course);

      // Build curriculum
      if (dto.curriculum?.length) {
        for (let mi = 0; mi < dto.curriculum.length; mi++) {
          const modDto = dto.curriculum[mi];
          const module = queryRunner.manager.create(CurriculumModule, {
            title: modDto.title,
            order_index: modDto.order_index ?? mi,
            course_id: savedCourse.id,
          });
          const savedModule = await queryRunner.manager.save(CurriculumModule, module);

          if (modDto.lessons?.length) {
            for (let li = 0; li < modDto.lessons.length; li++) {
              const lessonTitle = typeof modDto.lessons[li] === 'string'
                ? modDto.lessons[li] as string
                : (modDto.lessons[li] as any).title;

              const lesson = queryRunner.manager.create(Lesson, {
                title: lessonTitle,
                order_index: li,
                module_id: savedModule.id,
              });
              await queryRunner.manager.save(Lesson, lesson);
            }
          }
        }
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedCourse.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── FIND ALL (with filters, search, pagination) ─────────────────────────
  async findAll(query: QueryCoursesDto) {
    const {
      search, category, level, instructor_id, language,
      is_featured, min_price, max_price,
      sort_by = 'created_at', sort_order = 'DESC',
      page = 1, limit = 12,
    } = query;

    const qb = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.tags', 'tags')
      .leftJoinAndSelect('course.curriculum', 'curriculum')
      .leftJoinAndSelect('curriculum.lessons', 'lessons');

    if (search) {
      qb.andWhere(
        '(course.title LIKE :search OR course.short_description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      qb.andWhere('category.name = :category', { category });
    }

    if (level) {
      qb.andWhere('course.level = :level', { level });
    }

    if (instructor_id) {
      qb.andWhere('course.instructor_id = :instructor_id', { instructor_id });
    }

    if (language) {
      qb.andWhere('course.language = :language', { language });
    }

    if (is_featured !== undefined) {
      qb.andWhere('course.is_featured = :is_featured', { is_featured });
    }

    if (min_price !== undefined) {
      qb.andWhere('course.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      qb.andWhere('course.price <= :max_price', { max_price });
    }

    const allowedSortFields = ['title', 'price', 'average_rating', 'total_enrollments', 'created_at'];
    const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
    qb.orderBy(`course.${safeSortBy}`, sort_order);

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  // ─── FIND BY SECTION (for homepage sections) ──────────────────────────────
  async findBySection(section: string, limit = 10): Promise<Course[]> {
    const qb = this.courseRepo
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('course.category', 'category')
      .leftJoinAndSelect('course.tags', 'tags')
      .take(limit);

    switch (section) {
      case 'recommended':
        qb.orderBy('course.average_rating', 'DESC');
        break;
      case 'enrolled':
        // In real app: filter by user enrollments. For now return all.
        qb.orderBy('course.total_enrollments', 'DESC');
        break;
      case 'explore':
        qb.orderBy('course.created_at', 'DESC');
        break;
      case 'trending':
        qb.orderBy('course.total_enrollments', 'DESC').addOrderBy('course.average_rating', 'DESC');
        break;
      default:
        qb.orderBy('course.created_at', 'DESC');
    }

    return qb.getMany();
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────
  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['instructor', 'category', 'tags', 'curriculum', 'curriculum.lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Course with id "${id}" not found`);
    }

    // Sort curriculum and lessons by order_index
    if (course.curriculum) {
      course.curriculum.sort((a, b) => a.order_index - b.order_index);
      course.curriculum.forEach((m) => {
        if (m.lessons) m.lessons.sort((a, b) => a.order_index - b.order_index);
      });
    }

    return course;
  }

  // ─── FIND BY INSTRUCTOR ───────────────────────────────────────────────────
  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.courseRepo.find({
      where: { instructor_id: instructorId },
      relations: ['category', 'tags', 'curriculum', 'curriculum.lessons'],
      order: { created_at: 'DESC' },
    });
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // Handle tags update
    if (dto.tags !== undefined) {
      const tags: Tag[] = [];
      for (const name of dto.tags) {
        let tag = await this.tagRepo.findOne({ where: { name } });
        if (!tag) {
          tag = this.tagRepo.create({ name });
          tag = await this.tagRepo.save(tag);
        }
        tags.push(tag);
      }
      course.tags = tags;
    }

    // Handle curriculum replacement
    if (dto.curriculum !== undefined) {
      // Delete old modules (cascade deletes lessons)
      if (course.curriculum?.length) {
        await this.moduleRepo.delete({ course_id: id });
      }
      // Create new modules
      for (let mi = 0; mi < dto.curriculum.length; mi++) {
        const modDto = dto.curriculum[mi];
        const module = this.moduleRepo.create({
          title: modDto.title,
          order_index: modDto.order_index ?? mi,
          course_id: id,
        });
        const savedModule = await this.moduleRepo.save(module);

        if (modDto.lessons?.length) {
          for (let li = 0; li < modDto.lessons.length; li++) {
            const lessonTitle = typeof modDto.lessons[li] === 'string'
              ? modDto.lessons[li] as string
              : (modDto.lessons[li] as any).title;

            const lesson = this.lessonRepo.create({
              title: lessonTitle,
              order_index: li,
              module_id: savedModule.id,
            });
            await this.lessonRepo.save(lesson);
          }
        }
      }
    }

    // Update scalar fields
    const { tags: _tags, curriculum: _curriculum, ...scalarFields } = dto;
    Object.assign(course, scalarFields);
    await this.courseRepo.save(course);

    return this.findOne(id);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string): Promise<{ message: string }> {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
    return { message: `Course "${course.title}" deleted successfully` };
  }

  // ─── STATS (for lecturer dashboard) ───────────────────────────────────────
  async getInstructorStats(instructorId: string) {
    const courses = await this.findByInstructor(instructorId);
    const totalEnrollments = courses.reduce((a, c) => a + (c.total_enrollments || 0), 0);
    const totalRevenue = courses.reduce((a, c) => a + (c.price * c.total_enrollments || 0), 0);
    const avgRating = courses.length
      ? courses.reduce((a, c) => a + Number(c.average_rating), 0) / courses.length
      : 0;

    return {
      total_courses: courses.length,
      total_enrollments: totalEnrollments,
      total_revenue: totalRevenue,
      average_rating: Math.round(avgRating * 10) / 10,
    };
  }
}
