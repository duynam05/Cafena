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

  async findBySlug(slug: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
  }

  async findByIdOrSlug(idOrSlug: string): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        OR: [
          { ProductID: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true },
        },
      },
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

  async findNewest(limit: number = 8): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { isActive: true },
      take: limit,
      orderBy: { CreateDate: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findFeatured(limit: number = 8): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      orderBy: { CreateDate: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async findBestSellers(limit: number = 8): Promise<any[]> {
    // 1. Thống kê số lượng bán qua OrderItems
    const topItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: limit,
    });

    const topIds = topItems.map((item) => item.productId);

    if (topIds.length > 0) {
      const products = await this.prisma.product.findMany({
        where: {
          ProductID: { in: topIds },
          isActive: true,
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      // Gắn kèm số lượng đã bán
      return products.map((p) => {
        const itemStat = topItems.find((t) => t.productId === p.ProductID);
        return {
          ...p,
          totalSold: itemStat?._sum.quantity || 0,
        };
      }).sort((a, b) => b.totalSold - a.totalSold);
    }

    // Nếu chưa có đơn hàng, lấy các sản phẩm nổi bật/mới nhất làm đại diện
    const fallbackProducts = await this.prisma.product.findMany({
      where: { isActive: true },
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { CreateDate: 'desc' }],
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return fallbackProducts.map((p) => ({ ...p, totalSold: 0 }));
  }

  async findRelated(product: Product, limit: number = 4): Promise<Product[]> {
    const whereConditions: Prisma.ProductWhereInput[] = [];

    if (product.categoryId) {
      whereConditions.push({ categoryId: product.categoryId });
    }
    if (product.ProductType) {
      whereConditions.push({ ProductType: product.ProductType });
    }

    return this.prisma.product.findMany({
      where: {
        ProductID: { not: product.ProductID },
        isActive: true,
        ...(whereConditions.length > 0 ? { OR: whereConditions } : {}),
      },
      take: limit,
      orderBy: { CreateDate: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async upsert(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.upsert({
      where: { ProductID: data.ProductID },
      update: {
        ProductName: data.ProductName,
        slug: data.slug,
        PathImage: data.PathImage,
        images: data.images,
        ProductType: data.ProductType,
        Quantity: data.Quantity,
        Unit: data.Unit,
        Price: data.Price,
        Description: data.Description,
        isActive: data.isActive,
        roastLevel: data.roastLevel,
        flavorNotes: data.flavorNotes,
        origin: data.origin,
        isFeatured: data.isFeatured,
      },
      create: data,
    });
  }
}
