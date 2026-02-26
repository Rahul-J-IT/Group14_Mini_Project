import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly repo: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto): Promise<Tag> {
    let tag = await this.repo.findOne({ where: { name: dto.name } });
    if (!tag) {
      tag = this.repo.create(dto);
      tag = await this.repo.save(tag);
    }
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  async remove(id: string): Promise<{ message: string }> {
    const tag = await this.repo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag "${id}" not found`);
    await this.repo.remove(tag);
    return { message: 'Tag deleted' };
  }
}
