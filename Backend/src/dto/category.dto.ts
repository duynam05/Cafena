import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from './pagination.dto.js';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Cà Phê Rang Mộc', description: 'Tên danh mục cà phê' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    example: 'ca-phe-rang-moc',
    description: 'Đường dẫn tĩnh slug chuẩn SEO (tự sinh nếu để trống)',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'Các dòng cà phê hạt nguyên chất tuyển chọn từ nông trường Cầu Đất và Buôn Ma Thuột',
    description: 'Mô tả chi tiết danh mục',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: null,
    description: 'ID của danh mục cha (để trống nếu đây là danh mục gốc cao nhất)',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({
    example: true,
    default: true,
    description: 'Trạng thái hiển thị (true = Hiển thị trên Menu, false = Ẩn danh mục)',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class QueryCategoryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm theo Tên danh mục, Slug hoặc Mô tả',
    example: 'Arabica',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID danh mục cha (truyền "root" hoặc "null" để lấy danh mục gốc)',
    example: 'root',
  })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái hiển thị (true = Đang hiển thị, false = Bị ẩn)',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value === 'true' || value === true || value === 1 || value === '1' ? true : value === 'false' || value === false || value === 0 || value === '0' ? false : undefined))
  @IsBoolean()
  isActive?: boolean;
}

export class CategoryProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Bao gồm cả sản phẩm của các danh mục con trực thuộc',
    default: true,
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  includeChildren?: boolean = true;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm sản phẩm trong danh mục',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Giá tối thiểu (VNĐ)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Giá tối đa (VNĐ)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Chỉ lấy sản phẩm còn hàng trong kho',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  inStockOnly?: boolean;
}
