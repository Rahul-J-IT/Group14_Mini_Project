import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsString() @MaxLength(300) title: string;
  @IsOptional() @IsString() video_url?: string;
  @IsOptional() @IsNumber() @Type(() => Number) duration_minutes?: number;
  @IsOptional() @IsNumber() @Type(() => Number) order_index?: number;
  @IsOptional() is_free_preview?: boolean;
}

export class CreateModuleDto {
  @IsString() @MaxLength(200) title: string;
  @IsOptional() @IsNumber() @Type(() => Number) order_index?: number;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateLessonDto)
  lessons?: CreateLessonDto[];
}
