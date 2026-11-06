import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import fs from 'fs';
import { UserService } from '../services/user.service.js';
import {
  UpdateProfileDto,
  ChangePasswordDto,
  CreateAddressDto,
  UpdateAddressDto,
  UserOrderQueryDto,
  UpdateUserAdminDto,
} from '../dto/user.dto.js';
import { CurrentUser } from '../guards/current-user.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

// Khởi tạo thư mục uploads/avatars nếu chưa tồn tại
const avatarUploadDir = './uploads/avatars';
if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

@ApiTags('Quản lý Tài khoản & Người dùng (User Management)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ==========================================
  // 1. QUẢN LÝ THÔNG TIN TÀI KHOẢN CÁ NHÂN
  // ==========================================

  @Get('profile')
  @ApiOperation({
    summary: 'Lấy thông tin tài khoản hiện tại',
    description: 'Xem thông tin cá nhân của tài khoản đang đăng nhập kèm danh bạ địa chỉ và tổng số đơn hàng.',
  })
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({
    summary: 'Cập nhật họ tên, email, số điện thoại',
    description: 'Cập nhật thông tin cá nhân. Nếu cập nhật email mới, hệ thống sẽ đánh dấu isEmailVerified=false và gửi mã xác thực lại.',
  })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }

  @Patch('profile/avatar')
  @ApiOperation({
    summary: 'Cập nhật ảnh đại diện (Tải lên tệp ảnh)',
    description: 'Tải lên ảnh đại diện định dạng JPEG, PNG, WEBP, GIF (kích thước tối đa 5MB).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary', description: 'Tệp ảnh đại diện cần tải lên' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: avatarUploadDir,
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|gif)$/i)) {
          return callback(
            new BadRequestException('Định dạng tệp không được hỗ trợ! Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF.'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  updateAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: any,
  ) {
    return this.userService.updateAvatar(userId, file);
  }

  @Post('profile/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thay đổi mật khẩu tài khoản',
    description: 'Người dùng nhập mật khẩu hiện tại và mật khẩu mới.',
  })
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(userId, dto);
  }

  // ==========================================
  // 2. QUẢN LÝ DANH BẠ ĐỊA CHỈ GIAO HÀNG
  // ==========================================

  @Get('addresses')
  @ApiOperation({
    summary: 'Lấy danh sách địa chỉ giao hàng của bản thân',
    description: 'Danh sách các địa chỉ giao hàng đã lưu của người dùng (sắp xếp địa chỉ mặc định lên đầu).',
  })
  getAddresses(@CurrentUser('id') userId: string) {
    return this.userService.getAddresses(userId);
  }

  @Post('addresses')
  @ApiOperation({
    summary: 'Thêm mới địa chỉ giao hàng',
    description: 'Thêm địa chỉ giao hàng mới vào danh bạ (tự động đặt làm mặc định nếu là địa chỉ đầu tiên).',
  })
  createAddress(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.userService.createAddress(userId, dto);
  }

  @Patch('addresses/:addressId')
  @ApiOperation({
    summary: 'Cập nhật địa chỉ giao hàng',
    description: 'Chỉnh sửa thông tin người nhận, số điện thoại hoặc địa chỉ chi tiết.',
  })
  updateAddress(
    @CurrentUser('id') userId: string,
    @Param('addressId') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.userService.updateAddress(userId, addressId, dto);
  }

  @Delete('addresses/:addressId')
  @ApiOperation({
    summary: 'Xóa địa chỉ giao hàng',
    description: 'Xóa một địa chỉ khỏi danh bạ.',
  })
  deleteAddress(
    @CurrentUser('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.deleteAddress(userId, addressId);
  }

  @Patch('addresses/:addressId/default')
  @ApiOperation({
    summary: 'Thiết lập địa chỉ mặc định',
    description: 'Đặt địa chỉ được chọn làm địa chỉ giao hàng mặc định cho tài khoản.',
  })
  setDefaultAddress(
    @CurrentUser('id') userId: string,
    @Param('addressId') addressId: string,
  ) {
    return this.userService.setDefaultAddress(userId, addressId);
  }

  // ==========================================
  // 3. LỊCH SỬ MUA HÀNG & CHI TIẾT ĐƠN HÀNG
  // ==========================================

  @Get('orders')
  @ApiOperation({
    summary: 'Xem lịch sử mua hàng của bản thân',
    description: 'Danh sách các đơn hàng đã đặt của người dùng kèm phân trang và bộ lọc theo trạng thái.',
  })
  getMyOrders(
    @CurrentUser('id') userId: string,
    @Query() query: UserOrderQueryDto,
  ) {
    return this.userService.getMyOrders(userId, query);
  }

  @Get('orders/:orderId')
  @ApiOperation({
    summary: 'Xem chi tiết đơn hàng của bản thân',
    description: 'Xem chi tiết một đơn hàng kèm danh sách sản phẩm, số lượng, giá và thông tin người nhận.',
  })
  getMyOrderDetail(
    @CurrentUser('id') userId: string,
    @Param('orderId') orderId: string,
  ) {
    return this.userService.getMyOrderDetail(userId, orderId);
  }

  // ==========================================
  // 4. QUẢN TRỊ NGƯỜI DÙNG DÀNH CHO ADMIN
  // ==========================================

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách người dùng hệ thống (Admin)' })
  @ApiQuery({ name: 'role', enum: Role, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('role') role?: Role,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAll(role, Number(page), Number(limit));
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xem chi tiết thông tin người dùng theo ID (Admin)' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin/vai trò/trạng thái người dùng (Admin)' })
  adminUpdate(@Param('id') id: string, @Body() dto: UpdateUserAdminDto) {
    return this.userService.adminUpdate(id, dto);
  }
}
