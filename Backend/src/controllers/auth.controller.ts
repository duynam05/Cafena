import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service.js';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordTokenDto,
  ResetPasswordOtpDto,
  VerifyEmailTokenDto,
  VerifyEmailOtpDto,
  ResendVerificationDto,
  ChangePasswordDto,
} from '../dto/auth.dto.js';
import { Public } from '../guards/public.decorator.js';
import { CurrentUser } from '../guards/current-user.decorator.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';

@ApiTags('Xác thực & Phân quyền (Authentication & Authorization)')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản khách hàng mới',
    description:
      'Tạo tài khoản khách hàng mới, tự động gửi email chào mừng kèm mã OTP & link xác thực. Cấp sẵn cặp Access Token & Refresh Token để đăng nhập ngay.',
  })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 409, description: 'Email đã tồn tại' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập hệ thống (Email & Password)',
    description:
      'Kiểm tra email, mật khẩu và trạng thái hoạt động của tài khoản (isActive). Trả về thông tin người dùng cùng cặp Access Token và Refresh Token.',
  })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Sai thông tin hoặc tài khoản bị khóa' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng xuất tài khoản',
    description: 'Vô hiệu hóa Refresh Token trong cơ sở dữ liệu để chống tái sử dụng token.',
  })
  logout(@CurrentUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới Access Token bằng Refresh Token',
    description:
      'Cơ chế Refresh Token Rotation: kiểm tra chữ ký JWT và so khớp với bản hash trong CSDL, sau đó cấp cặp token mới.',
  })
  refreshTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Quên mật khẩu - gửi mã OTP và liên kết qua email',
    description:
      'Sinh mã OTP 6 số (hết hạn sau 15 phút) và liên kết token bảo mật gửi vào email người dùng.',
  })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đặt lại mật khẩu bằng liên kết bảo mật (Token từ email)',
    description: 'Người dùng bấm vào liên kết trong email gửi kèm token để đổi mật khẩu mới.',
  })
  resetPasswordWithToken(@Body() dto: ResetPasswordTokenDto) {
    return this.authService.resetPasswordWithToken(dto);
  }

  @Public()
  @Post('reset-password-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đặt lại mật khẩu bằng mã OTP 6 số',
    description: 'Nhập trực tiếp mã OTP 6 số từ email để đặt mật khẩu mới.',
  })
  resetPasswordWithOtp(@Body() dto: ResetPasswordOtpDto) {
    return this.authService.resetPasswordWithOtp(dto);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác minh địa chỉ email bằng liên kết (Token từ email)',
    description: 'Kích hoạt cờ isEmailVerified = true khi người dùng nhấn vào liên kết xác nhận.',
  })
  verifyEmailWithToken(@Body() dto: VerifyEmailTokenDto) {
    return this.authService.verifyEmailWithToken(dto);
  }

  @Public()
  @Post('verify-email-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xác minh địa chỉ email bằng mã OTP 6 số',
    description: 'Nhập mã OTP 6 số nhận được trong email để xác minh tài khoản.',
  })
  verifyEmailWithOtp(@Body() dto: VerifyEmailOtpDto) {
    return this.authService.verifyEmailWithOtp(dto);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Gửi lại email xác thực tài khoản',
    description: 'Dành cho người dùng chưa xác minh email muốn nhận lại mã OTP hoặc liên kết mới.',
  })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đổi mật khẩu tài khoản (Đã đăng nhập)',
    description: 'Người dùng nhập mật khẩu hiện tại và mật khẩu mới.',
  })
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  @ApiOperation({
    summary: 'Xem thông tin tài khoản đang đăng nhập',
    description: 'Lấy thông tin tài khoản bao gồm vai trò, trạng thái kích hoạt, xác minh email.',
  })
  getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('check-status')
  @ApiOperation({
    summary: 'Kiểm tra nhanh trạng thái tài khoản & quyền hạn',
    description: 'Trả về trạng thái hoạt động (isActive), xác minh email (isEmailVerified) và vai trò (role).',
  })
  checkStatus(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    };
  }

  // --- ENDPOINTS KIỂM TRA PHÂN QUYỀN RBAC ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CUSTOMER, Role.STAFF, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get('test/customer-access')
  @ApiOperation({
    summary: 'Kiểm tra quyền truy cập: Khách hàng (Customer / Staff / Admin)',
  })
  testCustomerAccess(@CurrentUser() user: any) {
    return {
      message: 'Bạn có quyền truy cập khu vực Khách hàng!',
      currentUser: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STAFF, Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get('test/staff-access')
  @ApiOperation({
    summary: 'Kiểm tra quyền truy cập: Nhân viên (Staff & Admin)',
  })
  testStaffAccess(@CurrentUser() user: any) {
    return {
      message: 'Bạn có quyền truy cập khu vực Nhân viên nghiệp vụ!',
      currentUser: user,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Get('test/admin-access')
  @ApiOperation({
    summary: 'Kiểm tra quyền truy cập: Quản trị viên tối cao (Chỉ Admin)',
  })
  testAdminAccess(@CurrentUser() user: any) {
    return {
      message: 'Bạn có quyền truy cập khu vực Quản trị tối cao (Admin)!',
      currentUser: user,
    };
  }
}
