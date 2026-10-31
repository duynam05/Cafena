import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InventoryChangeType } from '@prisma/client';

export class AdjustInventoryDto {
  @ApiProperty({ example: 'CF-0001' })
  @IsString()
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  productId: string;

  @ApiProperty({ enum: InventoryChangeType, example: InventoryChangeType.IMPORT })
  @IsEnum(InventoryChangeType, { message: 'Loại điều chỉnh kho không hợp lệ' })
  type: InventoryChangeType;

  @ApiProperty({ example: 50, description: 'Số lượng thay đổi' })
  @IsInt()
  quantity: number;

  @ApiPropertyOptional({ example: 'Nhập lô hàng cà phê rang mới từ xưởng' })
  @IsOptional()
  @IsString()
  reason?: string;
}

