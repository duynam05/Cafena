import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { PrismaService } from '../repositories/prisma.service.js';
import { MailService } from './mail.service.js';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  UserOrderQueryDto,
  UpdateUserAdminDto,
} from '../dto/user.dto.js';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepo: UserRepository,
    @Inject(OrderRepository) private readonly orderRepo: OrderRepository,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(MailService) private readonly mailService: MailService,
  ) {}

  // ==========================================
  // 1. THÔNG TIN TÀI KHOẢN & HỒ SƠ
  // ==========================================

  /**
   * Lấy thông tin tài khoản hiện tại kèm danh bạ địa chỉ và số lượng đơn hàng
   */
  async getProfile(userId: string) {
    const user = await this.userRepo.findByIdWithAddresses(userId);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const orderCount = await this.prisma.order.count({ where: { userId } });

    const {
      password,
      hashedRefreshToken,
      emailVerifyOtp,
      emailVerifyToken,
      resetPasswordOtp,
      resetPasswordToken,
      ...safeUser
    } = user;

    return {
      ...safeUser,
      totalOrders: orderCount,
    };
  }

  /**
   * Cập nhật họ tên, email, số điện thoại, địa chỉ nhanh
   * Nếu đổi email mới: kiểm tra trùng lặp, đánh dấu isEmailVerified = false và gửi mã OTP xác thực lại
   */
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const currentUser = await this.userRepo.findById(userId);
    if (!currentUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const updateData: any = {};
    let emailChanged = false;

    if (dto.fullName) {
      updateData.fullName = dto.fullName.trim();
    }
    if (dto.phone !== undefined) {
      updateData.phone = dto.phone ? dto.phone.trim() : null;
    }
    if (dto.address !== undefined) {
      updateData.address = dto.address ? dto.address.trim() : null;
    }

    // Xử lý thay đổi Email
    if (dto.email && dto.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      const newEmail = dto.email.toLowerCase().trim();
      const existing = await this.userRepo.findByEmail(newEmail);
      if (existing && existing.id !== userId) {
        throw new ConflictException('Địa chỉ email mới này đã được người khác sử dụng');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      updateData.email = newEmail;
      updateData.isEmailVerified = false;
      updateData.emailVerifyOtp = otp;
      updateData.emailVerifyToken = token;
      updateData.emailVerifyExpires = expires;
      emailChanged = true;

      // Gửi email xác thực lại tới hòm thư mới
      await this.mailService.sendEmailVerification(
        newEmail,
        dto.fullName || currentUser.fullName,
        otp,
        token,
      );
    }

    const updatedUser = await this.userRepo.update(userId, updateData);

    const {
      password,
      hashedRefreshToken,
      emailVerifyOtp,
      emailVerifyToken,
      resetPasswordOtp,
      resetPasswordToken,
      ...safeUser
    } = updatedUser;

    return {
      message: emailChanged
        ? 'Cập nhật hồ sơ thành công! Bạn đã đổi địa chỉ email, vui lòng kiểm tra hộp thư để xác thực email mới.'
        : 'Cập nhật thông tin cá nhân thành công!',
      emailChanged,
      user: safeUser,
    };
  }

  /**
   * Cập nhật ảnh đại diện (Avatar) qua Upload file
   */
  async updateAvatar(userId: string, file: any) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp ảnh hợp lệ để tải lên');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Xóa ảnh đại diện cũ nếu là file cục bộ trong /uploads/avatars/
    if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
      const oldFilename = path.basename(user.avatar);
      const oldFilePath = path.join(process.cwd(), 'uploads', 'avatars', oldFilename);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch {
          // Bỏ qua lỗi xóa file cũ nếu file đã bị xóa
        }
      }
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const updated = await this.userRepo.update(userId, { avatar: avatarUrl });

    return {
      message: 'Cập nhật ảnh đại diện thành công!',
      avatar: updated.avatar,
    };
  }

  /**
   * Thay đổi mật khẩu người dùng đang đăng nhập
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

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('Mật khẩu mới không được trùng với mật khẩu cũ');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userRepo.update(userId, {
      password: hashedPassword,
      hashedRefreshToken: null, // Đăng xuất các phiên cũ
    });

    return {
      message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại bằng mật khẩu mới.',
    };
  }

  // ==========================================
  // 2. QUẢN LÝ ĐỊA CHỈ GIAO HÀNG
  // ==========================================

  /**
   * Lấy danh sách địa chỉ giao hàng của người dùng
   */
  async getAddresses(userId: string) {
    return this.userRepo.findAddressesByUserId(userId);
  }

  /**
   * Thêm mới địa chỉ giao hàng
   */
  async createAddress(userId: string, dto: CreateAddressDto) {
    const count = await this.userRepo.countAddresses(userId);
    // Nếu là địa chỉ đầu tiên, tự động gán isDefault = true
    const isDefault = count === 0 ? true : Boolean(dto.isDefault);

    const fullAddress =
      dto.fullAddress?.trim() ||
      [dto.streetAddress, dto.ward, dto.district, dto.province]
        .filter(Boolean)
        .join(', ');

    const newAddress = await this.userRepo.createAddress(userId, {
      recipientName: dto.recipientName.trim(),
      phone: dto.phone.trim(),
      streetAddress: dto.streetAddress.trim(),
      ward: dto.ward ? dto.ward.trim() : null,
      district: dto.district ? dto.district.trim() : null,
      province: dto.province ? dto.province.trim() : null,
      fullAddress,
      isDefault,
    });

    return {
      message: 'Thêm địa chỉ giao hàng mới thành công',
      address: newAddress,
    };
  }

  /**
   * Cập nhật địa chỉ giao hàng
   */
  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    const existing = await this.userRepo.findAddressById(addressId, userId);
    if (!existing) {
      throw new NotFoundException('Không tìm thấy địa chỉ giao hàng hoặc không thuộc quyền sở hữu của bạn');
    }

    const street = dto.streetAddress !== undefined ? dto.streetAddress.trim() : existing.streetAddress;
    const ward = dto.ward !== undefined ? (dto.ward ? dto.ward.trim() : null) : existing.ward;
    const district = dto.district !== undefined ? (dto.district ? dto.district.trim() : null) : existing.district;
    const province = dto.province !== undefined ? (dto.province ? dto.province.trim() : null) : existing.province;

    const fullAddress =
      dto.fullAddress?.trim() ||
      [street, ward, district, province].filter(Boolean).join(', ');

    const updated = await this.userRepo.updateAddress(addressId, userId, {
      ...(dto.recipientName !== undefined && { recipientName: dto.recipientName.trim() }),
      ...(dto.phone !== undefined && { phone: dto.phone.trim() }),
      ...(dto.streetAddress !== undefined && { streetAddress: street }),
      ...(dto.ward !== undefined && { ward }),
      ...(dto.district !== undefined && { district }),
      ...(dto.province !== undefined && { province }),
      fullAddress,
      ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
    });

    return {
      message: 'Cập nhật địa chỉ giao hàng thành công',
      address: updated,
    };
  }

  /**
   * Xóa một địa chỉ giao hàng
   */
  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.userRepo.findAddressById(addressId, userId);
    if (!existing) {
      throw new NotFoundException('Không tìm thấy địa chỉ giao hàng để xóa');
    }

    await this.userRepo.deleteAddress(addressId);

    // Nếu vừa xóa địa chỉ mặc định, tự động chỉ định địa chỉ gần nhất còn lại làm mặc định
    if (existing.isDefault) {
      const remaining = await this.userRepo.findAddressesByUserId(userId);
      if (remaining.length > 0) {
        await this.userRepo.setDefaultAddress(remaining[0].id, userId);
      }
    }

    return {
      message: 'Đã xóa địa chỉ giao hàng thành công',
    };
  }

  /**
   * Thiết lập một địa chỉ làm địa chỉ mặc định
   */
  async setDefaultAddress(userId: string, addressId: string) {
    const existing = await this.userRepo.findAddressById(addressId, userId);
    if (!existing) {
      throw new NotFoundException('Không tìm thấy địa chỉ giao hàng này');
    }

    const updated = await this.userRepo.setDefaultAddress(addressId, userId);

    return {
      message: 'Đã thiết lập địa chỉ mặc định thành công',
      address: updated,
    };
  }

  // ==========================================
  // 3. LỊCH SỬ MUA HÀNG & CHI TIẾT ĐƠN HÀNG
  // ==========================================

  /**
   * Xem danh sách lịch sử đơn hàng của bản thân (hỗ trợ phân trang, lọc theo trạng thái)
   */
  async getMyOrders(userId: string, query: UserOrderQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const { total, orders } = await this.orderRepo.findUserOrders(
      userId,
      skip,
      limit,
      query.status,
    );

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Xem chi tiết một đơn hàng của bản thân
   */
  async getMyOrderDetail(userId: string, orderId: string) {
    const order = await this.orderRepo.findOrderById(orderId);

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Không tìm thấy đơn hàng hoặc đơn hàng không thuộc về bạn');
    }

    return order;
  }

  // ==========================================
  // 4. QUẢN TRỊ ADMIN (DÀNH CHO ADMIN)
  // ==========================================

  async findAll(role?: Role, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (role) {
      where.role = role;
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          address: true,
          avatar: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          _count: {
            select: { orders: true, addresses: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        avatar: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        addresses: true,
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: true } } },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async adminUpdate(id: string, dto: UpdateUserAdminDto) {
    await this.findOne(id);
    return this.userRepo.update(id, dto);
  }
}
