import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { PatientGender } from '../entities/prescription.entity';
import { MedicineItemDto } from './medicine-item.dto';
import { TestItemDto } from './test-item.dto';
import { ChiefComplaintItemDto } from './chief-complaint-item.dto';
import { ExaminationItemDto } from './examination-item.dto';
import {
  DrugHistoryItemDto,
  FamilyHistoryItemDto,
  MedicalHistoryItemDto,
  OncologicHistoryItemDto,
  OtNoteItemDto,
  SurgicalHistoryItemDto,
  TitledHistoryItemDto,
} from './history-item.dto';

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Patient name', example: 'Rahim Uddin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  patient_name: string;

  @ApiPropertyOptional({ description: 'Patient age in years', example: 34 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  patient_age?: number;

  @ApiPropertyOptional({ enum: PatientGender })
  @IsEnum(PatientGender)
  @IsOptional()
  patient_gender?: PatientGender;

  @ApiPropertyOptional({ example: '01712345678' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  patient_phone?: string;

  @ApiPropertyOptional({ example: 'Mirpur, Dhaka' })
  @IsString()
  @IsOptional()
  patient_address?: string;

  @ApiPropertyOptional({
    description: 'Appointment this prescription was written for',
  })
  @IsUUID()
  @IsOptional()
  appointment_id?: string;

  @ApiPropertyOptional({
    description: 'Diagnosis notes',
    example: 'Recurrent tension headaches, no red-flag symptoms.',
  })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiPropertyOptional({ type: [ChiefComplaintItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChiefComplaintItemDto)
  chief_complaints?: ChiefComplaintItemDto[];

  @ApiPropertyOptional({ type: [ExaminationItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExaminationItemDto)
  examination_findings?: ExaminationItemDto[];

  @ApiPropertyOptional({ type: [MedicalHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MedicalHistoryItemDto)
  medical_history?: MedicalHistoryItemDto[];

  @ApiPropertyOptional({ type: [DrugHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => DrugHistoryItemDto)
  drug_history?: DrugHistoryItemDto[];

  @ApiPropertyOptional({ type: [FamilyHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FamilyHistoryItemDto)
  family_history?: FamilyHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TitledHistoryItemDto)
  allergy_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TitledHistoryItemDto)
  social_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [SurgicalHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SurgicalHistoryItemDto)
  surgical_history?: SurgicalHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TitledHistoryItemDto)
  sexual_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TitledHistoryItemDto)
  travel_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [OncologicHistoryItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OncologicHistoryItemDto)
  oncologic_history?: OncologicHistoryItemDto[];

  @ApiPropertyOptional({ type: [OtNoteItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OtNoteItemDto)
  ot_notes?: OtNoteItemDto[];

  @ApiPropertyOptional({ type: [MedicineItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MedicineItemDto)
  medicines?: MedicineItemDto[];

  @ApiPropertyOptional({ type: [TestItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TestItemDto)
  tests?: TestItemDto[];

  @ApiPropertyOptional({
    description: 'General advice / notes',
    example: 'Adequate hydration, reduce screen time, avoid skipping meals.',
  })
  @IsString()
  @IsOptional()
  advice?: string;

  @ApiPropertyOptional({ description: 'Follow-up date', example: '2026-03-20' })
  @IsDateString()
  @IsOptional()
  follow_up_date?: string;

  @ApiPropertyOptional({
    description: 'Prescription date (defaults to today)',
    example: '2026-03-10',
  })
  @IsDateString()
  @IsOptional()
  prescription_date?: string;
}

export class PrescriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  patient_name: string;

  @ApiPropertyOptional()
  patient_age?: number;

  @ApiPropertyOptional({ enum: PatientGender })
  patient_gender?: PatientGender;

  @ApiPropertyOptional()
  patient_phone?: string;

  @ApiPropertyOptional()
  patient_address?: string;

  @ApiPropertyOptional()
  appointment_id?: string;

  @ApiPropertyOptional()
  diagnosis?: string;

  @ApiPropertyOptional({ type: [ChiefComplaintItemDto] })
  chief_complaints?: ChiefComplaintItemDto[];

  @ApiPropertyOptional({ type: [ExaminationItemDto] })
  examination_findings?: ExaminationItemDto[];

  @ApiPropertyOptional({ type: [MedicalHistoryItemDto] })
  medical_history?: MedicalHistoryItemDto[];

  @ApiPropertyOptional({ type: [DrugHistoryItemDto] })
  drug_history?: DrugHistoryItemDto[];

  @ApiPropertyOptional({ type: [FamilyHistoryItemDto] })
  family_history?: FamilyHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  allergy_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  social_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [SurgicalHistoryItemDto] })
  surgical_history?: SurgicalHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  sexual_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [TitledHistoryItemDto] })
  travel_history?: TitledHistoryItemDto[];

  @ApiPropertyOptional({ type: [OncologicHistoryItemDto] })
  oncologic_history?: OncologicHistoryItemDto[];

  @ApiPropertyOptional({ type: [OtNoteItemDto] })
  ot_notes?: OtNoteItemDto[];

  @ApiPropertyOptional({ type: [MedicineItemDto] })
  medicines?: MedicineItemDto[];

  @ApiPropertyOptional({ type: [TestItemDto] })
  tests?: TestItemDto[];

  @ApiPropertyOptional()
  advice?: string;

  @ApiPropertyOptional()
  follow_up_date?: string;

  @ApiProperty()
  prescription_date: string;

  @ApiProperty()
  share_token: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional()
  deleted_at?: Date;
}
