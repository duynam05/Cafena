import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

const cartItemInclude = {
  product: {
    select: {
      ProductID: true,
      ProductName: true,
      slug: true,
      PathImage: true,
      ProductType: true,
      Price: true,
      Quantity: true,
      Unit: true,
      isActive: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
};

const cartInclude = {
  items: {
    include: cartItemInclude,
    orderBy: { id: 'asc' as const },
  },
};

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCartByUserId(userId: string) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
  }

  async createCart(userId: string) {
    return this.prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  }

  async findCartItemById(itemId: string) {
    return this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: true,
        cart: true,
      },
    });
  }

  async findCartItem(cartId: string, productId: string) {
    return this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId, productId },
      },
      include: {
        product: true,
      },
    });
  }

  async createCartItem(cartId: string, productId: string, quantity: number) {
    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });
  }

  async updateCartItemQuantity(itemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    });
  }

  async deleteCartItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async deleteCartItemForUser(userId: string, itemId: string) {
    return this.prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        cart: { userId },
      },
    });
  }

  async clearCartByUserId(userId: string) {
    return this.prisma.cartItem.deleteMany({
      where: {
        cart: { userId },
      },
    });
  }
}
