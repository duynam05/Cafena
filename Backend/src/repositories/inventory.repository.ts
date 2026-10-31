import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { InventoryChangeType } from '@prisma/client';

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProductsStock() {
    return this.prisma.product.findMany({
      select: {
        ProductID: true,
        ProductName: true,
        Quantity: true,
        Unit: true,
        Price: true,
        ProductType: true,
      },
      orderBy: { Quantity: 'asc' },
    });
  }

  async getInventoryLogs(skip: number, take: number) {
    const [total, logs] = await Promise.all([
      this.prisma.inventoryLog.count(),
      this.prisma.inventoryLog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { ProductID: true, ProductName: true, Unit: true },
          },
          createdBy: {
            select: { id: true, fullName: true, email: true },
          },
        },
      }),
    ]);
    return { total, logs };
  }

  async adjustInventory(params: {
    productId: string;
    type: InventoryChangeType;
    quantityChange: number;
    reason?: string;
    userId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { ProductID: params.productId },
        data: {
          Quantity: { increment: params.quantityChange },
        },
      });

      const log = await tx.inventoryLog.create({
        data: {
          productId: params.productId,
          type: params.type,
          quantity: params.quantityChange,
          balanceAfter: updatedProduct.Quantity,
          reason: params.reason || `Điều chỉnh kho (${params.type})`,
          createdById: params.userId,
        },
        include: {
          product: true,
        },
      });

      return { updatedProduct, log };
    });
  }
}

