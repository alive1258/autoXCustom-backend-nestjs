import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TransformToBoolean } from 'src/modules/blog-category/dto/create-blog-category.dto';
import { ProjectCategory } from '../entities/project.entity';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Vehicle make, model and year',
    example: 'Toyota Corolla Fielder 2020 Hybrid',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  vehicle: string;

  @ApiProperty({
    description: 'Work performed',
    example: 'Professional Polishing & Detailing',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  work: string;

  @ApiProperty({
    description: 'Result / outcome summary',
    example: 'Mirror-finish shine restored and protected for the long haul.',
  })
  @IsString()
  @IsNotEmpty()
  result: string;

  @ApiProperty({
    description: 'Project category',
    enum: ProjectCategory,
    example: ProjectCategory.DETAILING,
  })
  @IsEnum(ProjectCategory)
  category: ProjectCategory;

  @ApiPropertyOptional({
    description: 'Display order (lowest first)',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  })
  position?: number;

  @ApiPropertyOptional({ description: 'Is active', example: true, default: true })
  @TransformToBoolean()
  @IsOptional()
  @IsBoolean()
  is_active?: any;

  @ApiPropertyOptional({
    description: 'Project photo (set internally from the uploaded file)',
  })
  @IsOptional()
  image?: string;
}

export class ProjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vehicle: string;

  @ApiProperty()
  work: string;

  @ApiProperty()
  result: string;

  @ApiProperty({ enum: ProjectCategory })
  category: ProjectCategory;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty()
  position: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiPropertyOptional()
  deleted_at?: Date;
}
