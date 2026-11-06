import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role, OrderStatus } from '@prisma/client';
import { PaginationDto } from './pagination.dto.js';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn C', description: 'Họ và tên mới' })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để khoảng trắng rỗng' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'newemail@gmail.com', description: 'Địa chỉ email mới (nếu đổi sẽ yêu cầu xác thực lại)' })
  @IsOptional()
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email?: string;

  @ApiPropertyOptional({ example: '0988776655', description: 'Số điện thoại liên hệ' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '456 Hai Bà Trưng, Quận 1, TP.HCM', description: 'Địa chỉ nhanh' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123@', description: 'Mật khẩu hiện tại của bạn' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecretPass456@', description: 'Mật khẩu mới (tối thiểu 6 ký tự)' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword!: string;
}

export class CreateAddressDto {
  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người nhận hàng' })
  @IsString()
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  recipientName!: string;

  @ApiProperty({ example: '0901234567', description: 'Số điện thoại người nhận' })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại người nhận không được để trống' })
  phone!: string;

  @ApiProperty({ example: 'Số 12 ngõ 34 Phố Hoàng Cầu', description: 'Địa chỉ cụ thể (Số nhà, tên đường/tòa nhà)' })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ cụ thể không được để trống' })
  streetAddress!: string;

  @ApiPropertyOptional({ example: 'Phường Ô Chợ Dừa', description: 'Phường / Xã' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({ example: 'Quận Đống Đa', description: 'Quận / Huyện' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Hà Nội', description: 'Tỉnh / Thành phố' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'Số 12 ngõ 34 Phố Hoàng Cầu, Phường Ô Chợ Dừa, Quận Đống Đa, Hà Nội' })
  @IsOptional()
  @IsString()
  fullAddress?: string;

  @ApiPropertyOptional({ example: false, default: false, description: 'Đặt làm địa chỉ nhận hàng mặc định' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Số 12 ngõ 34 Phố Hoàng Cầu' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiPropertyOptional({ example: 'Phường Ô Chợ Dừa' })
  @IsOptional()
  @IsString()
  ward?: string;

  @ApiPropertyOptional({ example: 'Quận Đống Đa' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Hà Nội' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ example: 'Số 12 ngõ 34 Phố Hoàng Cầu, Phường Ô Chợ Dừa, Quận Đống Đa, Hà Nội' })
  @IsOptional()
  @IsString()
  fullAddress?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UserOrderQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: OrderStatus, description: 'Lọc đơn hàng theo trạng thái (PENDING, SHIPPING, COMPLETED, CANCELLED...)' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class UpdateUserAdminDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '456 Lê Lợi, TP.HCM' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.STAFF })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
