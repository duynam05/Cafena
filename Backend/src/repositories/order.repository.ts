import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { InventoryChangeType, OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartByUserId(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  async findCartItem(id: string) {
    return this.prisma.cartItem.findUnique({
      where: { id },
      include: { product: true },
    });
  }

  async updateCartItem(id: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  async createCartItem(cartId: string, productId: string, quantity: number) {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async removeCartItem(userId: string, cartItemId: string) {
    return this.prisma.cartItem.deleteMany({
      where: {
        id: cartItemId,
        cart: { userId },
      },
    });
  }

  async createOrderTransaction(params: {
    orderNumber: string;
    userId: string;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    note?: string;
    paymentMethod: string;
    totalAmount: number;
    items: { productId: string; quantity: number; price: number }[];
    cartId: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo đơn hàng
      const newOrder = await tx.order.create({
        data: {
          orderNumber: params.orderNumber,
          userId: params.userId,
          recipientName: params.recipientName,
          recipientPhone: params.recipientPhone,
          shippingAddress: params.shippingAddress,
          note: params.note,
          paymentMethod: params.paymentMethod || 'COD',
          totalAmount: params.totalAmount,
          items: {
            create: params.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // 2. Trừ kho và tạo log
      for (const item of params.items) {
        const updatedProduct = await tx.product.update({
          where: { ProductID: item.productId },
          data: {
            Quantity: { decrement: item.quantity },
          },
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            type: InventoryChangeType.ORDER_DEDUCT,
            quantity: -item.quantity,
            balanceAfter: updatedProduct.Quantity,
            reason: `Xuất kho cho đơn hàng ${params.orderNumber}`,
            createdById: params.userId,
          },
        });
      }

      // 3. Xoá giỏ hàng
      await tx.cartItem.deleteMany({
        where: { cartId: params.cartId },
      });

      return newOrder;
    });
  }

  async findOrdersByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserOrders(userId: string, skip: number, take: number, status?: OrderStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }
    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, orders };
  }

  async findAllOrders(skip: number, take: number, status?: OrderStatus) {
    const where = status ? { status } : {};
    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: { id: true, fullName: true, email: true, phone: true },
          },
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { total, orders };
  }

  async findOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        items: {
          include: { product: true },
        },
      },
    });
  }

  async updateOrderStatus(id: string, status?: OrderStatus, paymentStatus?: PaymentStatus) {
    return this.prisma.order.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }
}

