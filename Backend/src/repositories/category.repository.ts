import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          take: 10,
        },
      },
    });
  }

  async findByNameOrSlug(name: string, slug: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}

