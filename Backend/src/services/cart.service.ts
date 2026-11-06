import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { AddToCartDto } from '../dto/cart.dto.js';
import { getProductStockStatus } from './product.service.js';

@Injectable()
export class CartService {
  constructor(
    @Inject(CartRepository) private readonly cartRepo: CartRepository,
    @Inject(ProductRepository) private readonly productRepo: ProductRepository,
  ) {}

  /**
   * 1 & 2. Lấy thông tin chi tiết giỏ hàng (tự động tạo giỏ hàng nếu chưa có)
   * Tính toán tổng số lượng món và tổng tiền giỏ hàng
   */
  async getCart(userId: string) {
    let cart = await this.cartRepo.findCartByUserId(userId);

    if (!cart) {
      cart = await this.cartRepo.createCart(userId);
    }

    if (!cart) {
      throw new BadRequestException('Không thể khởi tạo giỏ hàng cho tài khoản');
    }

    // Tính toán thành tiền từng món và tổng giỏ hàng
    const items = cart.items.map((item) => {
      const itemTotal = item.quantity * item.product.Price;
      const stockStatus = getProductStockStatus(item.product.Quantity);
      const isAvailable = item.product.isActive && item.product.Quantity >= item.quantity;

      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        itemTotal,
        stockStatus,
        isAvailable,
        product: {
          ProductID: item.product.ProductID,
          ProductName: item.product.ProductName,
          slug: item.product.slug,
          PathImage: item.product.PathImage,
          ProductType: item.product.ProductType,
          Price: item.product.Price,
          Quantity: item.product.Quantity,
          Unit: item.product.Unit,
          isActive: item.product.isActive,
          category: item.product.category,
        },
      };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.itemTotal, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      totalItems,
      totalAmount,
      items,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  /**
   * 3, 4, 5. Thêm sản phẩm vào giỏ hàng (Kiểm tra tồn tại, kiểm tra kinh doanh & tồn kho)
   */
  async addToCart(userId: string, dto: AddToCartDto) {
    const quantityToAdd = Number(dto.quantity) || 1;

    // 4. Kiểm tra sản phẩm tồn tại trong hệ thống
    const product = await this.productRepo.findByIdOrSlug(dto.productId);
    if (!product) {
      throw new NotFoundException(`Sản phẩm "${dto.productId}" không tồn tại trong hệ thống`);
    }

    // Kiểm tra tình trạng kinh doanh
    if (!product.isActive) {
      throw new BadRequestException(`Sản phẩm "${product.ProductName}" hiện đang tạm ngừng kinh doanh`);
    }

    // 5. Kiểm tra số lượng tồn kho
    if (product.Quantity <= 0) {
      throw new BadRequestException(`Sản phẩm "${product.ProductName}" đã hết hàng trong kho`);
    }

    if (quantityToAdd > product.Quantity) {
      throw new BadRequestException(
        `Số lượng sản phẩm trong kho không đủ (chỉ còn ${product.Quantity} ${product.Unit})`,
      );
    }

    let cart = await this.cartRepo.findCartByUserId(userId);
    if (!cart) {
      cart = await this.cartRepo.createCart(userId);
    }
    if (!cart) {
      throw new BadRequestException('Không thể khởi tạo giỏ hàng cho tài khoản');
    }

    // Kiểm tra món đã có trong giỏ hàng chưa
    const existingItem = await this.cartRepo.findCartItem(cart.id, product.ProductID);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantityToAdd;
      if (newQuantity > product.Quantity) {
        throw new BadRequestException(
          `Kho chỉ còn ${product.Quantity} ${product.Unit}, bạn đã có ${existingItem.quantity} trong giỏ hàng. Không thể thêm vượt quá tồn kho.`,
        );
      }

      await this.cartRepo.updateCartItemQuantity(existingItem.id, newQuantity);
    } else {
      await this.cartRepo.createCartItem(cart.id, product.ProductID, quantityToAdd);
    }

    const updatedCart = await this.getCart(userId);
    return {
      message: `Đã thêm ${quantityToAdd} ${product.Unit} "${product.ProductName}" vào giỏ hàng thành công!`,
      cart: updatedCart,
    };
  }

  /**
   * 6. Cập nhật số lượng của một sản phẩm trong giỏ hàng
   */
  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    const item = await this.cartRepo.findCartItemById(itemId);
    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Mục giỏ hàng không tồn tại hoặc không thuộc quyền sở hữu của bạn');
    }

    if (!item.product.isActive) {
      throw new BadRequestException(`Sản phẩm "${item.product.ProductName}" hiện đã tạm ngừng kinh doanh`);
    }

    if (quantity > item.product.Quantity) {
      throw new BadRequestException(
        `Số lượng kho không đủ (kho chỉ còn ${item.product.Quantity} ${item.product.Unit})`,
      );
    }

    await this.cartRepo.updateCartItemQuantity(itemId, quantity);
    const updatedCart = await this.getCart(userId);

    return {
      message: 'Cập nhật số lượng sản phẩm trong giỏ hàng thành công',
      cart: updatedCart,
    };
  }

  /**
   * 7. Xóa một sản phẩm khỏi giỏ hàng
   */
  async removeItem(userId: string, itemId: string) {
    const item = await this.cartRepo.findCartItemById(itemId);
    if (!item || item.cart.userId !== userId) {
      throw new NotFoundException('Mục giỏ hàng không tồn tại hoặc không thuộc quyền sở hữu của bạn');
    }

    await this.cartRepo.deleteCartItemForUser(userId, itemId);
    const updatedCart = await this.getCart(userId);

    return {
      message: 'Đã xóa sản phẩm khỏi giỏ hàng thành công',
      cart: updatedCart,
    };
  }

  /**
   * 8. Xóa toàn bộ giỏ hàng (Clear Cart)
   */
  async clearCart(userId: string) {
    await this.cartRepo.clearCartByUserId(userId);
    const updatedCart = await this.getCart(userId);

    return {
      message: 'Đã xóa toàn bộ sản phẩm trong giỏ hàng thành công',
      cart: updatedCart,
    };
  }

  /**
   * 11. Kiểm tra lại giá sản phẩm & số lượng tồn kho trước khi đặt hàng (Validate Cart Before Checkout)
   */
  async validateCart(userId: string) {
    const cart = await this.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      return {
        isValid: false,
        canCheckout: false,
        message: 'Giỏ hàng đang trống',
        totalItems: 0,
        totalAmount: 0,
        warnings: ['Giỏ hàng của bạn đang trống, vui lòng thêm sản phẩm trước khi tiến hành đặt hàng.'],
        items: [],
      };
    }

    const warnings: string[] = [];
    let hasError = false;

    for (const item of cart.items) {
      if (!item.product.isActive) {
        warnings.push(`Sản phẩm "${item.product.ProductName}" hiện đã ngừng kinh doanh. Vui lòng bỏ món này ra khỏi giỏ.`);
        hasError = true;
      } else if (item.product.Quantity <= 0) {
        warnings.push(`Sản phẩm "${item.product.ProductName}" hiện đã hết hàng trong kho.`);
        hasError = true;
      } else if (item.quantity > item.product.Quantity) {
        warnings.push(
          `Sản phẩm "${item.product.ProductName}" chỉ còn ${item.product.Quantity} ${item.product.Unit} trong kho (bạn đang đặt ${item.quantity}). Vui lòng giảm số lượng.`,
        );
        hasError = true;
      }
    }

    return {
      isValid: !hasError,
      canCheckout: !hasError,
      message: hasError
        ? 'Một số sản phẩm trong giỏ hàng đã thay đổi tồn kho hoặc ngừng kinh doanh, vui lòng kiểm tra lại.'
        : 'Toàn bộ sản phẩm trong giỏ hàng đều hợp lệ, sẵn sàng thanh toán!',
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      warnings,
      items: cart.items,
    };
  }
}
