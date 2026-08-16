import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { BloodGroup } from '../entities/prescription.entity';

const MAX_READINGS = 20;

export class ExaminationItemDto {
  @ApiPropertyOptional({ enum: BloodGroup })
  @IsEnum(BloodGroup)
  @IsOptional()
  blood_group?: BloodGroup;

  @ApiPropertyOptional({ description: 'Height in centimeters', example: 165 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(300)
  @IsOptional()
  height_cm?: number;

  @ApiPropertyOptional({ description: 'Weight in kilograms', example: 60 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(500)
  @IsOptional()
  weight_kg?: number;

  @ApiPropertyOptional({
    description: 'Blood pressure readings in mmHg, entered individually',
    example: [120, 80],
    type: [Number],
  })
  @Type(() => Number)
  @IsArray()
  @ArrayMaxSize(MAX_READINGS)
  @IsNumber({}, { each: true })
  @Min(20, { each: true })
  @Max(300, { each: true })
  @IsOptional()
  bp_readings?: number[];

  @ApiPropertyOptional({
    description: 'Temperature readings in Fahrenheit',
    example: [98.6],
    type: [Number],
  })
  @Type(() => Number)
  @IsArray()
  @ArrayMaxSize(MAX_READINGS)
  @IsNumber({}, { each: true })
  @Min(70, { each: true })
  @Max(115, { each: true })
  @IsOptional()
  temperature_readings?: number[];

  @ApiPropertyOptional({
    description: 'Pulse readings in beats/min',
    example: [72],
    type: [Number],
  })
  @Type(() => Number)
  @IsArray()
  @ArrayMaxSize(MAX_READINGS)
  @IsNumber({}, { each: true })
  @Min(20, { each: true })
  @Max(300, { each: true })
  @IsOptional()
  pulse_readings?: number[];

  @ApiPropertyOptional({ description: 'Body Mass Index, server-calculated' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  bmi?: number;

  @ApiPropertyOptional({
    description: 'WHO adult BMI category, server-calculated',
    example: 'Obese',
  })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  bmi_category?: string;

  @ApiPropertyOptional({ description: 'Body Surface Area (m²), server-calculated' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  bsa?: number;

  @ApiPropertyOptional({ description: 'Ideal Body Weight (kg), server-calculated' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  ibw?: number;

  @ApiPropertyOptional({
    description: 'Manual-entry Z-Score (pediatric growth-chart module pending)',
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  z_score?: number;

  @ApiPropertyOptional({ description: 'Free-text note', example: 'Taken while seated' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
