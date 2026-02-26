import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurriculumModule } from './entities/curriculum-module.entity';
import { Lesson } from './entities/lesson.entity';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(CurriculumModule)
    private readonly moduleRepo: Repository<CurriculumModule>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  async addModule(courseId: string, dto: CreateModuleDto): Promise<CurriculumModule> {
    const module = this.moduleRepo.create({ ...dto, course_id: courseId });
    const saved = await this.moduleRepo.save(module);

    if (dto.lessons?.length) {
      for (let i = 0; i < dto.lessons.length; i++) {
        const l = dto.lessons[i];
        const lesson = this.lessonRepo.create({
          title: l.title,
          video_url: l.video_url,
          duration_minutes: l.duration_minutes ?? 0,
          order_index: l.order_index ?? i,
          is_free_preview: l.is_free_preview ?? false,
          module_id: saved.id,
        });
        await this.lessonRepo.save(lesson);
      }
    }

    const curriculumModule = await this.moduleRepo.findOne({
  where: { id: saved.id },
  relations: ['lessons'],
});

if (!curriculumModule) {
  throw new NotFoundException('Module not found');
}

return curriculumModule;
  }

  async updateModule(moduleId: string, dto: UpdateModuleDto): Promise<CurriculumModule> {
    const module = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!module) throw new NotFoundException(`Module "${moduleId}" not found`);
    const { lessons: _, ...fields } = dto;
    Object.assign(module, fields);
    return this.moduleRepo.save(module);
  }

  async removeModule(moduleId: string): Promise<{ message: string }> {
    const module = await this.moduleRepo.findOne({ where: { id: moduleId } });
    if (!module) throw new NotFoundException(`Module "${moduleId}" not found`);
    await this.moduleRepo.remove(module);
    return { message: 'Module deleted' };
  }

  async addLesson(moduleId: string, dto: any): Promise<Lesson> {
    const lesson = this.lessonRepo.create({ ...dto, module_id: moduleId });
    return (await this.lessonRepo.save(lesson))[0];
  }

  async updateLesson(lessonId: string, dto: any): Promise<Lesson> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException(`Lesson "${lessonId}" not found`);
    Object.assign(lesson, dto);
    return this.lessonRepo.save(lesson);
  }

  async removeLesson(lessonId: string): Promise<{ message: string }> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException(`Lesson "${lessonId}" not found`);
    await this.lessonRepo.remove(lesson);
    return { message: 'Lesson deleted' };
  }
}
