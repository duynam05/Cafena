import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Cà Phê Rang Xay', description: 'Tên danh mục' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'ca-phe-rang-xay', description: 'Đường dẫn tĩnh slug' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Các sản phẩm cà phê hạt rang mộc và cà phê bột nguyên chất' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

