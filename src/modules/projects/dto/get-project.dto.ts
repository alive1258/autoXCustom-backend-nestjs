import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/data-query/dto/data-query.dto';
import { ProjectCategory } from '../entities/project.entity';

class GetProjectBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by vehicle (partial match)',
    example: 'Corolla',
  })
  @IsOptional()
  @IsString()
  vehicle?: string;

  @ApiPropertyOptional({ enum: ProjectCategory })
  @IsOptional()
  @IsEnum(ProjectCategory)
  category?: ProjectCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  position?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_active?: boolean;
}

export class GetProjectDto extends IntersectionType(
  GetProjectBaseDto,
  PaginationQueryDto,
) {}
