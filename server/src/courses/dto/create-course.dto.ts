import {
  IsString, IsNumber, IsEnum, IsBoolean, IsOptional,
  IsArray, IsUrl, MaxLength, Min, IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  order_index?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lessons?: string[]; // lesson titles (simple create)
}

export class CreateCourseDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(500)
  short_description: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsOptional()
  @IsString()
  intro_video_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsString()
  language?: string;

  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  estimated_duration_minutes?: number;

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  what_you_learn?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @IsOptional()
  @IsUUID()
  instructor_id?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]; // tag names — auto created if not exist

  @IsOptional()
  @IsArray()
  curriculum?: CreateModuleDto[];
}
