// src/universities/dto/create-university.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// CREATE DTO
export class CreateUniversityDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  university_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  country: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  location: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsUrl({}, { message: 'Document URL must be a valid URL' })
  document_url?: string;

  @IsUrl({}, { message: 'Logo URL must be a valid URL' })
  logo_url?: string;
}

// UPDATE DTO
export class UpdateUniversityDto extends PartialType(CreateUniversityDto) {}
