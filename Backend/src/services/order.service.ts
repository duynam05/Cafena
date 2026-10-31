import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { AddCartItemDto, CreateOrderDto, UpdateOrderStatusDto } from '../dto/order.dto.js';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  /**
   * Lấy giỏ hàng của người dùng (tự tạo nếu chưa có)
   */
  async getCart(userId: string) {
    let cart = await this.orderRepo.findCartByUserId(userId);

    if (!cart) {
      cart = await this.orderRepo.createCart(userId);
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.quantity * item.product.Price;
    }, 0);

    return {
      ...cart,
      totalAmount,
      totalItems: cart.items.reduce((count, item) => count + item.quantity, 0),
    };
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  async addToCart(userId: string, dto: AddCartItemDto) {
    const product = await this.productRepo.findById(dto.productId);

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    if (product.Quantity < dto.quantity) {
      throw new BadRequestException(
        `Số lượng sản phẩm trong kho không đủ (chỉ còn ${product.Quantity} ${product.Unit})`,
      );
    }

    const cart = await this.getCart(userId);

    const existingItem = cart.items.find((i) => i.productId === dto.productId);
    if (existingItem) {
      const newQty = existingItem.quantity + dto.quantity;
      if (product.Quantity < newQty) {
        throw new BadRequestException(
          `Kho chỉ còn ${product.Quantity} sản phẩm, bạn đã có ${existingItem.quantity} trong giỏ`,
        );
      }

      await this.orderRepo.updateCartItem(existingItem.id, newQty);
    } else {
      await this.orderRepo.createCartItem(cart.id, dto.productId, dto.quantity);
    }

    return this.getCart(userId);
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ hàng
   */
  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeCartItem(userId, cartItemId);
    }

    const item = await this.orderRepo.findCartItem(cartItemId);

    if (!item) {
      throw new NotFoundException('Mục giỏ hàng không tồn tại');
    }

    if (item.product.Quantity < quantity) {
      throw new BadRequestException(
        `Số lượng kho không đủ (chỉ còn ${item.product.Quantity} ${item.product.Unit})`,
      );
    }

    await this.orderRepo.updateCartItem(cartItemId, quantity);
    return this.getCart(userId);
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  async removeCartItem(userId: string, cartItemId: string) {
    await this.orderRepo.removeCartItem(userId, cartItemId);
    return this.getCart(userId);
  }

  /**
   * Đặt hàng từ giỏ hàng (Checkout)
   */
  async checkout(userId: string, dto: CreateOrderDto) {
    const cart = await this.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng đang trống, không thể đặt hàng');
    }

    // Kiểm tra tồn kho trước khi đặt
    for (const item of cart.items) {
      if (item.product.Quantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm "${item.product.ProductName}" không đủ tồn kho (chỉ còn ${item.product.Quantity})`,
        );
      }
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await this.orderRepo.createOrderTransaction({
      orderNumber,
      userId,
      recipientName: dto.recipientName,
      recipientPhone: dto.recipientPhone,
      shippingAddress: dto.shippingAddress,
      note: dto.note,
      paymentMethod: dto.paymentMethod || 'COD',
      totalAmount: cart.totalAmount,
      items: cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.Price,
      })),
      cartId: cart.id,
    });

    return order;
  }

  /**
   * Lịch sử đơn hàng của khách hàng
   */
  async getMyOrders(userId: string) {
    return this.orderRepo.findOrdersByUserId(userId);
  }

  /**
   * Chi tiết một đơn hàng
   */
  async getOrderDetail(orderId: string, userId?: string) {
    const order = await this.orderRepo.findOrderById(orderId);

    if (!order || (userId && order.userId !== userId)) {
      throw new NotFoundException('Không tìm thấy thông tin đơn hàng');
    }

    return order;
  }

  /**
   * Quản trị: Xem tất cả đơn hàng
   */
  async findAllOrders(status?: OrderStatus, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const { total, orders } = await this.orderRepo.findAllOrders(skip, limit, status);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Quản trị: Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return this.orderRepo.updateOrderStatus(orderId, dto.status, dto.paymentStatus);
  }
}

