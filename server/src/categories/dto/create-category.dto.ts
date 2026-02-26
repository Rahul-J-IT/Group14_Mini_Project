import { IsString, IsOptional, MaxLength } from 'class-validator';
export class CreateCategoryDto {
  @IsString() @MaxLength(100) name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon_url?: string;
}
