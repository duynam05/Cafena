import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'customer@gmail.com', description: 'Địa chỉ email tài khoản' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu (tối thiểu 6 ký tự)' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' })
  password!: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên đầy đủ' })
  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  fullName!: string;

  @ApiPropertyOptional({ example: '0901234567', description: 'Số điện thoại liên hệ' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Cầu Giấy, Hà Nội', description: 'Địa chỉ giao hàng mặc định' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'admin@cafena.vn', description: 'Email đăng nhập' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({ example: 'admin123', description: 'Mật khẩu đăng nhập' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password!: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'JWT Refresh Token được cấp khi đăng nhập/đăng ký' })
  @IsString()
  @IsNotEmpty({ message: 'Refresh token không được để trống' })
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'customer@gmail.com', description: 'Email tài khoản cần lấy lại mật khẩu' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;
}

export class ResetPasswordTokenDto {
  @ApiProperty({ description: 'Token bảo mật đặt lại mật khẩu nhận từ đường link email' })
  @IsString()
  @IsNotEmpty({ message: 'Mã token không được để trống' })
  token!: string;

  @ApiProperty({ example: 'newPassword123', description: 'Mật khẩu mới (tối thiểu 6 ký tự)' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword!: string;
}

export class ResetPasswordOtpDto {
  @ApiProperty({ example: 'customer@gmail.com', description: 'Email tài khoản cần đặt lại mật khẩu' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Mã OTP gồm 6 chữ số nhận qua email' })
  @IsString()
  @Length(6, 6, { message: 'Mã OTP phải có đúng 6 chữ số' })
  otp!: string;

  @ApiProperty({ example: 'newPassword123', description: 'Mật khẩu mới (tối thiểu 6 ký tự)' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword!: string;
}

export class VerifyEmailTokenDto {
  @ApiProperty({ description: 'Token bảo mật xác thực email nhận từ link' })
  @IsString()
  @IsNotEmpty({ message: 'Token xác thực không được để trống' })
  token!: string;
}

export class VerifyEmailOtpDto {
  @ApiProperty({ example: 'customer@gmail.com', description: 'Email tài khoản cần xác thực' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;

  @ApiProperty({ example: '123456', description: 'Mã OTP 6 số nhận qua email' })
  @IsString()
  @Length(6, 6, { message: 'Mã OTP phải có đúng 6 chữ số' })
  otp!: string;
}

export class ResendVerificationDto {
  @ApiProperty({ example: 'customer@gmail.com', description: 'Email tài khoản cần nhận lại mã xác thực' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  currentPassword!: string;

  @ApiProperty({ example: 'newSecretPassword123', description: 'Mật khẩu mới' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword!: string;
}
