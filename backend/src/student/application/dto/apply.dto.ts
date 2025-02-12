import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class ApplyDto {
  shortlist_id: number;

  // @IsNumber()
  // @IsNotEmpty()
  // course_id: number;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(2)
  // name: string;

  // @IsString()
  // @IsNotEmpty()
  // level: string;

  // @IsNumber()
  // @IsNotEmpty()
  // tution_fee: number;

  // @IsArray()
  // intake: string;

  // @IsArray()
  // awards: string[];

  // @IsString()
  // @IsNotEmpty()
  // subject: string;

  // @IsString()
  // @IsNotEmpty()
  // duration: string;

  // @IsOptional()
  // @IsUrl({}, { message: 'Document URL must be a valid URL' })
  // document_url?: string;

  // @IsArray()
  // @ArrayMinSize(1)
  // requirements: string[];

  // @IsNotEmpty()
  // university_id: number; // Assuming you have the ID of the university as a number
}
