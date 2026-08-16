import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ComplaintDurationUnit,
  FamilyMember,
  OncologicTherapyCategory,
} from '../entities/prescription.entity';

const MAX_FAMILY_MEMBERS = Object.keys(FamilyMember).length;

export class MedicalHistoryItemDto {
  @ApiProperty({ description: 'Diagnosis name', example: 'Hydronephrosis' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  diagnosis: string;

  @ApiPropertyOptional({ description: 'Free-text comment', example: 'well' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment?: string;
}

export class DrugHistoryItemDto {
  @ApiProperty({ description: 'Medicine name', example: 'Aspirin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  medicine_name: string;

  @ApiPropertyOptional({ description: 'How long the drug has been taken', example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(999)
  @IsOptional()
  duration_value?: number;

  @ApiPropertyOptional({ enum: ComplaintDurationUnit })
  @IsEnum(ComplaintDurationUnit)
  @IsOptional()
  duration_unit?: ComplaintDurationUnit;
}

export class FamilyHistoryItemDto {
  @ApiProperty({ description: 'Diagnosis name', example: 'Menopause' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  diagnosis: string;

  @ApiPropertyOptional({ enum: FamilyMember, isArray: true })
  @IsArray()
  @ArrayMaxSize(MAX_FAMILY_MEMBERS)
  @IsEnum(FamilyMember, { each: true })
  @IsOptional()
  family_members?: FamilyMember[];
}

/** Shared DTO for Allergy / Social / Sexual / Travel history — identical
 * title + description + comment shape, different section headings in the UI. */
export class TitledHistoryItemDto {
  @ApiProperty({ description: 'Title', example: 'Penicillin allergy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Comment' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment?: string;
}

export class SurgicalHistoryItemDto extends TitledHistoryItemDto {
  @ApiPropertyOptional({ description: 'Therapy/surgery date', example: '2024-03-10' })
  @IsDateString()
  @IsOptional()
  therapy_date?: string;
}

export class OncologicHistoryItemDto {
  @ApiProperty({ enum: OncologicTherapyCategory })
  @IsEnum(OncologicTherapyCategory)
  category: OncologicTherapyCategory;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: 'Therapy date', example: '2024-03-10' })
  @IsDateString()
  @IsOptional()
  therapy_date?: string;

  @ApiPropertyOptional({ description: 'Comment' })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  comment?: string;
}

export class OtNoteItemDto {
  @ApiProperty({ description: 'Operation date', example: '2024-03-10' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Operation time (free text, e.g. "10:30 AM")', example: '10:30 AM' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  time: string;

  @ApiProperty({ description: 'Name of the operation', example: 'Appendectomy' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  operation_name: string;

  @ApiProperty({ description: 'Name of the indication', example: 'Acute appendicitis' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  indication_name: string;

  @ApiPropertyOptional({ description: 'Type of anesthesia', example: 'General' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  anesthesia_type?: string;

  @ApiPropertyOptional({ description: 'Anaesthesiologist name' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  anaesthesiologist_name?: string;

  @ApiPropertyOptional({ description: 'Surgeon name' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  surgeon_name?: string;

  @ApiPropertyOptional({ description: 'Assistant surgeon name' })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  assistant_surgeon_name?: string;
}
