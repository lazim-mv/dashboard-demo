// src/courses/dto/create-course.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsArray,
  ArrayMinSize,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// CREATE DTO
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  tution_fee: string;

  @IsArray()
  @ArrayMinSize(1)
  intake: string[];

  @IsArray()
  awards: string[];

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsOptional()
  @IsUrl({}, { message: 'Document URL must be a valid URL' })
  document_url?: string;

  @IsArray()
  @ArrayMinSize(1)
  requirements: string[];

  @IsNotEmpty()
  university_id: number; // Assuming you have the ID of the university as a number
}

// UPDATE DTO
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
