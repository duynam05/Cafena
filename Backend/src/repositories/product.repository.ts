import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return this.prisma.product.count({ where });
  }

  async findById(ProductID: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { ProductID },
      include: { category: true },
    });
  }

  async findMany(params: {
    where?: Prisma.ProductWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<Product[]> {
    const { where, skip, take, orderBy } = params;
    return this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: { category: true },
    });
  }

  async update(ProductID: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { ProductID },
      data,
      include: { category: true },
    });
  }

  async delete(ProductID: string): Promise<Product> {
    return this.prisma.product.delete({
      where: { ProductID },
    });
  }

  async deleteMany(productIds: string[]): Promise<number> {
    const result = await this.prisma.product.deleteMany({
      where: { ProductID: { in: productIds } },
    });
    return result.count;
  }

  async findByIds(productIds: string[]): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { ProductID: { in: productIds } },
      include: { category: true },
    });
  }

  async findAllForExport(): Promise<any[]> {
    return this.prisma.product.findMany({
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { CreateDate: 'desc' },
    });
  }

  async upsert(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.upsert({
      where: { ProductID: data.ProductID },
      update: {
        ProductName: data.ProductName,
        PathImage: data.PathImage,
        ProductType: data.ProductType,
        Quantity: data.Quantity,
        Unit: data.Unit,
        Price: data.Price,
        Description: data.Description,
        roastLevel: data.roastLevel,
        flavorNotes: data.flavorNotes,
        origin: data.origin,
      },
      create: data,
    });
  }

  async updateQuantity(ProductID: string, quantityChange: number): Promise<Product> {
    return this.prisma.product.update({
      where: { ProductID },
      data: {
        Quantity: { increment: quantityChange },
      },
    });
  }
}

