import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export class AddCartItemDto {
  @ApiProperty({ example: 'CF-0001', description: 'Mã sản phẩm' })
  @IsString()
  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  productId: string;

  @ApiProperty({ example: 1, default: 1, description: 'Số lượng mua' })
  @IsInt()
  @Min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' })
  quantity: number = 1;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  recipientName: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại người nhận không được để trống' })
  recipientPhone: string;

  @ApiProperty({ example: '123 Đường Cà Phê, Quận 1, TP.HCM' })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  shippingAddress: string;

  @ApiPropertyOptional({ example: 'Giao giờ hành chính, gọi trước khi đến' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional({ example: 'COD', default: 'COD' })
  @IsOptional()
  @IsString()
  paymentMethod?: string = 'COD';
}

export class UpdateOrderStatusDto {
  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.CONFIRMED })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.PAID })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}

