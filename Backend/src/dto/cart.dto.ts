import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiProperty({
    example: 'CF-0001',
    description: 'Mã định danh sản phẩm (ProductID)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  productId!: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Số lượng mua (tối thiểu 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng thêm vào giỏ phải lớn hơn hoặc bằng 1' })
  quantity?: number = 1;
}

export class UpdateCartItemDto {
  @ApiProperty({
    example: 2,
    description: 'Số lượng mới cho món trong giỏ (nếu truyền <= 0 sẽ tự động xóa món khỏi giỏ)',
  })
  @Type(() => Number)
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng không được âm' })
  quantity!: number;
}
