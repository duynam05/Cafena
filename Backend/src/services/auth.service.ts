import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { MailService } from './mail.service.js';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordTokenDto,
  ResetPasswordOtpDto,
  VerifyEmailTokenDto,
  VerifyEmailOtpDto,
  ResendVerificationDto,
  ChangePasswordDto,
} from '../dto/auth.dto.js';
import { Role } from '@prisma/client';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(OrderRepository) private readonly orderRepo: OrderRepository,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(MailService) private readonly mailService: MailService,
  ) {}

  /**
   * 1. Đăng ký tài khoản khách hàng mới
   */
  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findByEmail(dto.email.toLowerCase());

    if (existing) {
      throw new ConflictException('Địa chỉ email này đã được đăng ký trong hệ thống');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Sinh mã OTP 6 số và Token xác thực email
    const otp = this.generateOtp();
    const token = this.generateSecureToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 giờ

    const user = await this.userRepo.create({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      fullName: dto.fullName,
      phone: dto.phone,
      address: dto.address,
      role: Role.CUSTOMER,
      isActive: true,
      isEmailVerified: false,
      emailVerifyOtp: otp,
      emailVerifyToken: token,
      emailVerifyExpires: expires,
    });

    // Tạo giỏ hàng mặc định cho tài khoản
    await this.orderRepo.createCart(user.id);

    // Cấp cặp Token
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    // Gửi email xác thực
    await this.mailService.sendEmailVerification(
      user.email,
      user.fullName,
      otp,
      token,
    );

    return {
      message: 'Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * 2. Đăng nhập hệ thống bằng email và mật khẩu
   */
  async login(dto: LoginDto) {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // Kiểm tra trạng thái tài khoản
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.');
    }

    // Cấp cặp Token mới
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateHashedRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'Đăng nhập thành công',
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * 3. Đăng xuất tài khoản (vô hiệu hóa Refresh Token)
   */
  async logout(userId: string) {
    await this.userRepo.updateRefreshToken(userId, null);
    return {
      message: 'Đăng xuất thành công. Refresh token đã được thu hồi an toàn.',
    };
  }

  /**
   * 4. Làm mới Access Token bằng Refresh Token
   */
  async refreshTokens(refreshToken: string) {
    try {
      const refreshSecret = this.configService.get<string>(
        'jwt.refreshSecret',
        'cafena_super_secret_refresh_key_2026_change_in_production',
      );

      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.userRepo.findById(payload.sub);
      if (!user || !user.isActive || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Quyền truy cập bị từ chối');
      }

      const isRefreshTokenMatch = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isRefreshTokenMatch) {
        throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã bị thu hồi');
      }

      // Xoay vòng Refresh Token (Token Rotation)
      const newTokens = await this.generateTokens(user.id, user.email, user.role);
      await this.updateHashedRefreshToken(user.id, newTokens.refreshToken);

      return {
        message: 'Làm mới Access Token thành công',
        ...newTokens,
      };
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }
  }

  /**
   * 5. Quên mật khẩu - gửi mã OTP và link qua email
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase());

    if (!user) {
      return {
        message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến bạn.',
      };
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản này đã bị khóa, không thể đặt lại mật khẩu.');
    }

    const otp = this.generateOtp();
    const token = this.generateSecureToken();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    await this.userRepo.update(user.id, {
      resetPasswordOtp: otp,
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });

    await this.mailService.sendPasswordReset(user.email, user.fullName, otp, token);

    return {
      message: 'Mã OTP và liên kết đặt lại mật khẩu đã được gửi đến email của bạn.',
    };
  }

  /**
   * 6. Đặt lại mật khẩu bằng Token từ đường dẫn Email
   */
  async resetPasswordWithToken(dto: ResetPasswordTokenDto) {
    const user = await this.userRepo.findByResetPasswordToken(dto.token);

    if (
      !user ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepo.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordOtp: null,
      resetPasswordExpires: null,
      hashedRefreshToken: null, // Buộc đăng nhập lại toàn bộ thiết bị
    });

    return {
      message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.',
    };
  }

  /**
   * 7. Đặt lại mật khẩu bằng mã OTP 6 số
   */
  async resetPasswordWithOtp(dto: ResetPasswordOtpDto) {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase());

    if (
      !user ||
      user.resetPasswordOtp !== dto.otp ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      throw new BadRequestException('Mã OTP không chính xác hoặc đã hết hạn');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepo.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordOtp: null,
      resetPasswordExpires: null,
      hashedRefreshToken: null,
    });

    return {
      message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.',
    };
  }

  /**
   * 8. Xác minh email bằng Token từ đường link
   */
  async verifyEmailWithToken(dto: VerifyEmailTokenDto) {
    const user = await this.userRepo.findByEmailVerifyToken(dto.token);

    if (
      !user ||
      !user.emailVerifyExpires ||
      user.emailVerifyExpires < new Date()
    ) {
      throw new BadRequestException('Liên kết xác thực email không hợp lệ hoặc đã hết hạn');
    }

    await this.userRepo.update(user.id, {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyOtp: null,
      emailVerifyExpires: null,
    });

    return {
      message: 'Xác thực email thành công! Tài khoản của bạn đã được kích hoạt hoàn toàn.',
    };
  }

  /**
   * 9. Xác minh email bằng mã OTP 6 số
   */
  async verifyEmailWithOtp(dto: VerifyEmailOtpDto) {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase());

    if (
      !user ||
      user.emailVerifyOtp !== dto.otp ||
      !user.emailVerifyExpires ||
      user.emailVerifyExpires < new Date()
    ) {
      throw new BadRequestException('Mã OTP xác thực không chính xác hoặc đã hết hạn');
    }

    await this.userRepo.update(user.id, {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyOtp: null,
      emailVerifyExpires: null,
    });

    return {
      message: 'Xác thực email thành công! Tài khoản của bạn đã được kích hoạt hoàn toàn.',
    };
  }

  /**
   * 10. Gửi lại mã / liên kết xác thực email
   */
  async resendVerification(dto: ResendVerificationDto) {
    const user = await this.userRepo.findByEmail(dto.email.toLowerCase());

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Tài khoản này đã được xác thực email trước đó rồi');
    }

    const otp = this.generateOtp();
    const token = this.generateSecureToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.userRepo.update(user.id, {
      emailVerifyOtp: otp,
      emailVerifyToken: token,
      emailVerifyExpires: expires,
    });

    await this.mailService.sendEmailVerification(user.email, user.fullName, otp, token);

    return {
      message: 'Mã xác thực mới đã được gửi lại vào email của bạn.',
    };
  }

  /**
   * 11. Đổi mật khẩu tài khoản
   */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepo.update(userId, {
      password: hashedPassword,
      hashedRefreshToken: null,
    });

    return {
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.',
    };
  }

  /**
   * 12. Lấy thông tin cá nhân tài khoản hiện tại
   */
  async getProfile(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return this.sanitizeUser(user);
  }

  // --- PRIVATE HELPER METHODS ---

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<TokenPair> {
    const accessSecret = this.configService.get<string>(
      'jwt.secret',
      'cafena_super_secret_jwt_key_2026_change_in_production',
    );
    const accessExpiresIn = this.configService.get<string>('jwt.expiresIn', '1h');

    const refreshSecret = this.configService.get<string>(
      'jwt.refreshSecret',
      'cafena_super_secret_refresh_key_2026_change_in_production',
    );
    const refreshExpiresIn = this.configService.get<string>(
      'jwt.refreshExpiresIn',
      '7d',
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, role, tokenType: 'access' },
        { secret: accessSecret, expiresIn: accessExpiresIn as any },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, role, tokenType: 'refresh' },
        { secret: refreshSecret, expiresIn: refreshExpiresIn as any },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateHashedRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.updateRefreshToken(userId, hashed);
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private sanitizeUser(user: any) {
    const {
      password,
      hashedRefreshToken,
      emailVerifyOtp,
      emailVerifyToken,
      resetPasswordOtp,
      resetPasswordToken,
      ...safeUser
    } = user;
    return safeUser;
  }
}
