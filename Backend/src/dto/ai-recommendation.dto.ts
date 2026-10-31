import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RecommendationQueryDto {
  @ApiPropertyOptional({
    example: 'Socola, Caramel, Hạt dẻ, Hương hoa',
    description: 'Hương vị yêu thích mong muốn',
  })
  @IsOptional()
  @IsString()
  preferredFlavors?: string;

  @ApiPropertyOptional({
    example: 'Medium',
    description: 'Mức độ rang yêu thích: Light, Medium, Dark, Medium-Dark',
  })
  @IsOptional()
  @IsString()
  preferredRoast?: string;

  @ApiPropertyOptional({
    example: 'Hạt rang mộc',
    description: 'Loại sản phẩm cà phê mong muốn',
  })
  @IsOptional()
  @IsString()
  preferredType?: string;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Mức giá tối thiểu',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional({
    example: 300000,
    description: 'Mức giá tối đa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiPropertyOptional({
    example: 6,
    default: 6,
    description: 'Số lượng sản phẩm gợi ý tối đa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 6;
}

