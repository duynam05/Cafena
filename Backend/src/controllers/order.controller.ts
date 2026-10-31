import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service.js';
import { AddCartItemDto, CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto.js';
import { CurrentUser } from '../guards/current-user.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { OrderStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Giỏ hàng & Đơn hàng (Orders & Cart)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // --- CART ENDPOINTS ---
  @Get('cart')
  @ApiOperation({ summary: 'Xem giỏ hàng hiện tại của khách hàng' })
  getCart(@CurrentUser('id') userId: string) {
    return this.orderService.getCart(userId);
  }

  @Post('cart')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  addToCart(@CurrentUser('id') userId: string, @Body() dto: AddCartItemDto) {
    return this.orderService.addToCart(userId, dto);
  }

  @Patch('cart/:itemId')
  @ApiOperation({ summary: 'Cập nhật số lượng của một món trong giỏ hàng' })
  updateCartItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.orderService.updateCartItem(userId, itemId, Number(quantity));
  }

  @Delete('cart/:itemId')
  @ApiOperation({ summary: 'Xóa một món khỏi giỏ hàng' })
  removeCartItem(@CurrentUser('id') userId: string, @Param('itemId') itemId: string) {
    return this.orderService.removeCartItem(userId, itemId);
  }

  // --- CHECKOUT & ORDER ENDPOINTS ---
  @Post('checkout')
  @ApiOperation({ summary: 'Tạo đơn hàng từ giỏ hàng (Checkout) & tự động trừ kho' })
  checkout(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    return this.orderService.checkout(userId, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Lịch sử mua hàng của khách hàng đang đăng nhập' })
  getMyOrders(@CurrentUser('id') userId: string) {
    return this.orderService.getMyOrders(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết đơn hàng' })
  getOrderDetail(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.orderService.getOrderDetail(id, userId);
  }

  // --- ADMIN MANAGEMENT ENDPOINTS ---
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Get('admin/all')
  @ApiOperation({ summary: 'Quản trị viên / Nhân viên: Xem toàn bộ danh sách đơn hàng' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAllOrders(
    @Query('status') status?: OrderStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.orderService.findAllOrders(status, Number(page), Number(limit));
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch('admin/:id/status')
  @ApiOperation({ summary: 'Quản trị viên / Nhân viên: Cập nhật trạng thái đơn hàng & thanh toán' })
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateOrderStatus(id, dto);
  }
}

