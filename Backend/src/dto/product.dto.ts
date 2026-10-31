import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto.js';

export class CreateProductDto {
  @ApiPropertyOptional({
    description: 'Mã định danh sản phẩm (tự sinh mã CF-xxxx nếu để trống)',
    example: 'CF-0001',
  })
  @IsOptional()
  @IsString()
  ProductID?: string;

  @ApiProperty({
    description: 'Tên sản phẩm cà phê',
    example: 'Cà phê Robusta Nguyên Chất Đắk Lắk 500g',
  })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  @IsString()
  ProductName: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn ảnh sản phẩm',
    example: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
  })
  @IsOptional()
  @IsString()
  PathImage?: string;

  @ApiProperty({
    description: 'Loại sản phẩm (Cà phê hạt, Cà phê bột, Dụng cụ pha chế, Máy pha...)',
    example: 'Cà phê bột',
  })
  @IsNotEmpty({ message: 'Loại sản phẩm không được để trống' })
  @IsString()
  ProductType: string;

  @ApiPropertyOptional({
    description: 'Số lượng tồn kho ban đầu',
    default: 0,
    example: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Số lượng không được âm' })
  Quantity?: number = 0;

  @ApiPropertyOptional({
    description: 'Đơn vị tính (gói, hộp, túi, kg, chiếc, bộ...)',
    default: 'gói',
    example: 'gói',
  })
  @IsOptional()
  @IsString()
  Unit?: string = 'gói';

  @ApiProperty({
    description: 'Đơn giá bán (VNĐ)',
    example: 120000,
  })
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống' })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Giá sản phẩm không được âm' })
  Price: number;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết sản phẩm',
    example: 'Hương vị đậm đà, vị đắng thanh thoát cùng hậu vị ngọt dịu truyền thống Việt Nam.',
  })
  @IsOptional()
  @IsString()
  Description?: string;

  @ApiPropertyOptional({
    description: 'Độ rang (Light, Medium, Medium-Dark, Dark)',
    example: 'Medium-Dark',
  })
  @IsOptional()
  @IsString()
  roastLevel?: string;

  @ApiPropertyOptional({
    description: 'Hương vị chủ đạo (Chocolate, Nutty, Fruity, Floral, Caramel)',
    example: 'Chocolate, Nutty',
  })
  @IsOptional()
  @IsString()
  flavorNotes?: string;

  @ApiPropertyOptional({
    description: 'Vùng xuất xứ hạt cà phê (Buôn Ma Thuột, Cầu Đất, Đà Lạt, Sơn La...)',
    example: 'Buôn Ma Thuột',
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục sản phẩm',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class QueryProductDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm theo Tên, Mô tả, Mã sản phẩm (ProductID)',
    example: 'Robusta',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo Loại sản phẩm (ProductType)',
    example: 'Cà phê bột',
  })
  @IsOptional()
  @IsString()
  productType?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID danh mục',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

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
    description: 'Sắp xếp theo trường (CreateDate, Price, Quantity, ProductName)',
    default: 'CreateDate',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'CreateDate';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp (asc hoặc desc)',
    default: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BatchDeleteDto {
  @ApiProperty({
    description: 'Danh sách các ProductID cần xóa được chọn từ checkbox bảng',
    example: ['CF-0001', 'CF-0002'],
    type: [String],
  })
  @IsArray({ message: 'ids phải là một mảng các mã sản phẩm' })
  @IsNotEmpty({ message: 'Danh sách mã sản phẩm cần xóa không được rỗng' })
  ids: string[];
}

export class BatchDuplicateDto {
  @ApiProperty({
    description: 'Danh sách các ProductID cần nhân bản hàng loạt',
    example: ['CF-0001', 'CF-0002'],
    type: [String],
  })
  @IsArray({ message: 'ids phải là một mảng các mã sản phẩm' })
  @IsNotEmpty({ message: 'Danh sách mã sản phẩm cần sao chép không được rỗng' })
  ids: string[];
}

