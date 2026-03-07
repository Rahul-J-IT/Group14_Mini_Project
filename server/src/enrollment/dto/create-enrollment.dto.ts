import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
