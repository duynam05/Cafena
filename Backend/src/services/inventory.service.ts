import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { AdjustInventoryDto } from '../dto/inventory.dto.js';
import { InventoryChangeType } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepo: InventoryRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  /**
   * Xem tình trạng tồn kho, cảnh báo các mặt hàng sắp hết (dưới 10 đơn vị)
   */
  async getStockOverview() {
    const products = await this.inventoryRepo.getAllProductsStock();

    const lowStockThreshold = 10;
    const lowStockItems = products.filter((p) => p.Quantity <= lowStockThreshold);
    const outOfStockItems = products.filter((p) => p.Quantity === 0);

    return {
      totalProducts: products.length,
      outOfStockCount: outOfStockItems.length,
      lowStockCount: lowStockItems.length,
      lowStockItems,
      products,
    };
  }

  /**
   * Lịch sử biến động xuất/nhập kho
   */
  async getInventoryLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const { total, logs } = await this.inventoryRepo.getInventoryLogs(skip, limit);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Điều chỉnh tồn kho thủ công (Nhập hàng, Kiểm kê bù trừ)
   */
  async adjustStock(userId: string, dto: AdjustInventoryDto) {
    const product = await this.productRepo.findById(dto.productId);

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ${dto.productId}`);
    }

    let delta = dto.quantity;
    if (dto.type === InventoryChangeType.EXPORT && delta > 0) {
      delta = -delta;
    }

    const newBalance = product.Quantity + delta;
    if (newBalance < 0) {
      throw new BadRequestException(
        `Không thể xuất kho quá số lượng tồn hiện có (Hiện tại: ${product.Quantity}, Xuất: ${Math.abs(delta)})`,
      );
    }

    const { updatedProduct, log } = await this.inventoryRepo.adjustInventory({
      productId: dto.productId,
      type: dto.type,
      quantityChange: delta,
      reason: dto.reason || 'Điều chỉnh kho thủ công',
      userId,
    });

    return {
      message: 'Cập nhật kho thành công',
      product: updatedProduct,
      log,
    };
  }
}

