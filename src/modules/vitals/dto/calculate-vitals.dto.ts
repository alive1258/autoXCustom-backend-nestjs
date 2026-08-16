import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { PatientGender } from 'src/modules/prescriptions/entities/prescription.entity';

export class CalculateVitalsDto {
  @ApiProperty({ description: 'Height in centimeters', example: 165 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(300)
  height_cm: number;

  @ApiPropertyOptional({
    description:
      'Weight in kilograms — required for BMI/BSA, not needed for an IBW-only calculation',
    example: 60,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.5)
  @Max(500)
  @IsOptional()
  weight_kg?: number;

  @ApiPropertyOptional({
    enum: PatientGender,
    description: 'Required only for Ideal Body Weight (Devine formula)',
  })
  @IsEnum(PatientGender)
  @IsOptional()
  patient_gender?: PatientGender;
}

export class VitalsResultDto {
  @ApiPropertyOptional({
    description: 'Body Mass Index (kg/m²) — omitted when weight_kg is not provided',
    example: 22.0,
  })
  bmi?: number;

  @ApiPropertyOptional({
    description: 'WHO adult BMI category — omitted when weight_kg is not provided',
    example: 'Normal',
    enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
  })
  bmi_category?: string;

  @ApiPropertyOptional({
    description:
      'Body Surface Area in m² (Mosteller formula) — omitted when weight_kg is not provided',
    example: 1.65,
  })
  bsa?: number;

  @ApiPropertyOptional({
    description:
      'Ideal Body Weight in kg (Devine formula) — omitted when patient_gender is not provided',
    example: 58.9,
  })
  ibw?: number;
}
