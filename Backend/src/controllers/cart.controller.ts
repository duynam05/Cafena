import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
import { CartService } from '../services/cart.service.js';
import { AddToCartDto, UpdateCartItemDto } from '../dto/cart.dto.js';
import { CurrentUser } from '../guards/current-user.decorator.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';

@ApiTags('Quản lý Giỏ hàng (Shopping Cart)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy thông tin giỏ hàng hiện tại',
    description:
      'Lấy danh sách các sản phẩm trong giỏ, tự động tính tổng số lượng món (totalItems) và tổng tiền giỏ hàng (totalAmount). Tự động tạo giỏ nếu khách chưa có.',
  })
  @ApiResponse({ status: 200, description: 'Lấy giỏ hàng thành công' })
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Thêm sản phẩm vào giỏ hàng',
    description:
      'Kiểm tra sản phẩm tồn tại, kiểm tra tình trạng kinh doanh (isActive) và kiểm tra số lượng tồn kho trước khi thêm hoặc tăng số lượng.',
  })
  @ApiResponse({ status: 201, description: 'Thêm vào giỏ hàng thành công' })
  @ApiResponse({ status: 400, description: 'Sản phẩm hết hàng hoặc số lượng vượt quá tồn kho' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  addToCart(
    @CurrentUser('id') userId: string,
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, dto);
  }

  @Get('validate')
  @ApiOperation({
    summary: 'Kiểm tra lại giá và số lượng tồn kho trước khi đặt hàng (Validate Before Checkout)',
    description:
      'Đối chiếu toàn bộ sản phẩm trong giỏ với CSDL thực tế: cảnh báo nếu có món tăng/giảm giá, hết hàng, hoặc không đủ số lượng tồn kho, trả về cờ isValid và canCheckout.',
  })
  @ApiResponse({ status: 200, description: 'Kiểm tra hợp lệ' })
  validateCart(@CurrentUser('id') userId: string) {
    return this.cartService.validateCart(userId);
  }

  @Patch('items/:itemId')
  @ApiOperation({
    summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng',
    description:
      'Cập nhật số lượng của một món trong giỏ hàng (nếu truyền quantity <= 0 sẽ tự động xóa món khỏi giỏ). Kiểm tra tồn kho trước khi cập nhật.',
  })
  @ApiResponse({ status: 200, description: 'Cập nhật số lượng thành công' })
  updateCartItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(userId, itemId, Number(dto.quantity));
  }

  @Delete('items/:itemId')
  @ApiOperation({
    summary: 'Xóa một sản phẩm khỏi giỏ hàng',
    description: 'Xóa một món cụ thể dựa theo cartItemId.',
  })
  @ApiResponse({ status: 200, description: 'Xóa món thành công' })
  removeCartItem(
    @CurrentUser('id') userId: string,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa toàn bộ giỏ hàng (Clear Cart)',
    description: 'Dọn sạch tất cả sản phẩm trong giỏ hàng chỉ với 1 thao tác.',
  })
  @ApiResponse({ status: 200, description: 'Đã xóa toàn bộ giỏ hàng' })
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
