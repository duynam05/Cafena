import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where?: Prisma.CategoryWhereInput): Promise<number> {
    return this.prisma.category.count({ where });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: { id: true, name: true, slug: true, isActive: true, _count: { select: { products: true } } },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: { id: true, name: true, slug: true, isActive: true, _count: { select: { products: true } } },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });
  }

  async findByIdOrSlug(idOrSlug: string): Promise<any | null> {
    return this.prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        parent: {
          select: { id: true, name: true, slug: true, isActive: true },
        },
        children: {
          select: { id: true, name: true, slug: true, isActive: true, _count: { select: { products: true } } },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });
  }

  async findByNameOrSlug(name: string, slug: string, excludeId?: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        AND: [
          excludeId ? { id: { not: excludeId } } : {},
          { OR: [{ name }, { slug }] },
        ],
      },
    });
  }

  async findTree(includeInactive: boolean = false): Promise<any[]> {
    const where: Prisma.CategoryWhereInput = {
      parentId: null,
      ...(!includeInactive ? { isActive: true } : {}),
    };

    return this.prisma.category.findMany({
      where,
      include: {
        children: {
          where: !includeInactive ? { isActive: true } : {},
          include: {
            children: {
              where: !includeInactive ? { isActive: true } : {},
              include: {
                _count: { select: { products: true } },
              },
              orderBy: { name: 'asc' },
            },
            _count: { select: { products: true } },
          },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findMany(params: {
    where?: Prisma.CategoryWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.CategoryOrderByWithRelationInput;
  }): Promise<any[]> {
    const { where, skip, take, orderBy } = params;
    return this.prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: orderBy || { name: 'asc' },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { products: true, children: true },
        },
      },
    });
  }

  /**
   * Đệ quy tìm toàn bộ ID danh mục con, cháu của một danh mục
   */
  async findDescendantIds(categoryId: string): Promise<string[]> {
    const result: string[] = [categoryId];

    const findChildrenRecursive = async (parentId: string) => {
      const children = await this.prisma.category.findMany({
        where: { parentId },
        select: { id: true },
      });

      for (const child of children) {
        result.push(child.id);
        await findChildrenRecursive(child.id);
      }
    };

    await findChildrenRecursive(categoryId);
    return result;
  }

  async countProducts(categoryId: string): Promise<number> {
    return this.prisma.product.count({
      where: { categoryId },
    });
  }

  async countChildren(categoryId: string): Promise<number> {
    return this.prisma.category.count({
      where: { parentId: categoryId },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
