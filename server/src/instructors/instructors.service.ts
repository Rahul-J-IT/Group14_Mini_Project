import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from './entities/instructor.entity';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorsService {
  constructor(
    @InjectRepository(Instructor)
    private readonly repo: Repository<Instructor>,
  ) {}

  async create(dto: CreateInstructorDto): Promise<Instructor> {
    const existing = await this.repo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Instructor with this email already exists');
    const instructor = this.repo.create(dto);
    return this.repo.save(instructor);
  }

  async findAll(): Promise<Instructor[]> {
    return this.repo.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string): Promise<Instructor> {
    const instructor = await this.repo.findOne({ where: { id }, relations: ['courses'] });
    if (!instructor) throw new NotFoundException(`Instructor "${id}" not found`);
    return instructor;
  }

  async update(id: string, dto: UpdateInstructorDto): Promise<Instructor> {
    const instructor = await this.findOne(id);
    Object.assign(instructor, dto);
    return this.repo.save(instructor);
  }

  async remove(id: string): Promise<{ message: string }> {
    const instructor = await this.findOne(id);
    await this.repo.remove(instructor);
    return { message: `Instructor "${instructor.name}" deleted` };
  }
}
