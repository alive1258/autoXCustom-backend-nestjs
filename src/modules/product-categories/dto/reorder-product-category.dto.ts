import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class ReorderProductCategoryItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsInt()
  position: number;
}

export class ReorderProductCategoryDto {
  @ApiProperty({ type: [ReorderProductCategoryItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderProductCategoryItemDto)
  items: ReorderProductCategoryItemDto[];
}
