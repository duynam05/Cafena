import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository.js';
import { PrismaService } from '../repositories/prisma.service.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
  CategoryProductQueryDto,
} from '../dto/category.dto.js';
import { calculatePagination } from '../utils/pagination.util.js';
import { slugify } from '../utils/slug.util.js';
import { getProductStockStatus } from './product.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CategoryRepository) private readonly categoryRepo: CategoryRepository,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  /**
   * Helper: Sinh slug SEO duy nhất cho danh mục
   */
  async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name);
    let candidate = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.categoryRepo.findByNameOrSlug('', candidate, excludeId);
      if (!existing) {
        return candidate;
      }
      candidate = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Tạo danh mục mới
   */
  async create(dto: CreateCategoryDto) {
    const slug = dto.slug ? slugify(dto.slug) : await this.generateUniqueSlug(dto.name);

    const existing = await this.categoryRepo.findByNameOrSlug(dto.name, slug);
    if (existing) {
      throw new ConflictException('Tên danh mục hoặc đường dẫn (slug) đã tồn tại trong hệ thống');
    }

    if (dto.parentId) {
      const parent = await this.categoryRepo.findById(dto.parentId);
      if (!parent) {
        throw new NotFoundException(`Không tìm thấy danh mục cha với ID "${dto.parentId}"`);
      }
    }

    return this.categoryRepo.create({
      name: dto.name.trim(),
      slug,
      description: dto.description?.trim(),
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
    });
  }

  /**
   * Lấy danh sách danh mục (hỗ trợ tìm kiếm, lọc theo cha-con, lọc hiển thị và phân trang)
   */
  async findAll(query: QueryCategoryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {};

    // 1. Tìm kiếm theo tên, slug, mô tả
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ];
    }

    // 2. Lọc theo danh mục cha
    if (query.parentId !== undefined) {
      if (query.parentId === 'root' || query.parentId === 'null' || !query.parentId) {
        where.parentId = null;
      } else {
        where.parentId = query.parentId;
      }
    }

    // 3. Lọc theo trạng thái ẩn/hiện
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [total, categories] = await Promise.all([
      this.categoryRepo.count(where),
      this.categoryRepo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      items: categories,
      meta: calculatePagination(total, page, limit),
    };
  }

  /**
   * Lấy cấu trúc cây danh mục đa cấp (Tree: Cha -> Con -> Cháu)
   */
  async getTree(includeInactive: boolean = false) {
    return this.categoryRepo.findTree(includeInactive);
  }

  /**
   * Lấy chi tiết danh mục theo ID hoặc Slug SEO
   */
  async findOne(idOrSlug: string) {
    const category = await this.categoryRepo.findByIdOrSlug(idOrSlug);

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với mã hoặc đường dẫn "${idOrSlug}"`);
    }

    return category;
  }

  /**
   * Lấy danh sách sản phẩm theo danh mục (tự động gom cả sản phẩm của danh mục con nếu includeChildren=true)
   */
  async getProductsByCategory(idOrSlug: string, query: CategoryProductQueryDto) {
    const category = await this.findOne(idOrSlug);

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    let categoryIds = [category.id];
    if (query.includeChildren !== false) {
      categoryIds = await this.categoryRepo.findDescendantIds(category.id);
    }

    const where: Prisma.ProductWhereInput = {
      categoryId: { in: categoryIds },
      isActive: true,
    };

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { ProductID: { contains: term, mode: 'insensitive' } },
        { ProductName: { contains: term, mode: 'insensitive' } },
        { Description: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.Price = {};
      if (query.minPrice !== undefined) where.Price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.Price.lte = Number(query.maxPrice);
    }

    if (query.inStockOnly) {
      where.Quantity = { gt: 0 };
    }

    const [total, rawProducts] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { CreateDate: 'desc' },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ]);

    const enrichedProducts = rawProducts.map((p) => ({
      ...p,
      stockStatus: getProductStockStatus(p.Quantity),
      canOrder: p.isActive && p.Quantity > 0,
    }));

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        isActive: category.isActive,
      },
      products: {
        items: enrichedProducts,
        meta: calculatePagination(total, page, limit),
      },
    };
  }

  /**
   * Cập nhật danh mục
   */
  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.findOne(id);

    // Kiểm tra danh mục cha hợp lệ
    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new BadRequestException('Một danh mục không thể tự chọn chính nó làm danh mục cha');
      }

      if (dto.parentId) {
        const parent = await this.categoryRepo.findById(dto.parentId);
        if (!parent) {
          throw new NotFoundException(`Không tìm thấy danh mục cha với ID "${dto.parentId}"`);
        }

        // Chống vòng lặp phân cấp: Danh mục con/cháu không thể làm cha của danh mục tổ tiên
        const descendants = await this.categoryRepo.findDescendantIds(id);
        if (descendants.includes(dto.parentId)) {
          throw new BadRequestException('Không thể chọn một danh mục con/cháu làm danh mục cha (nguy cơ lặp vòng phân cấp)');
        }
      }
    }

    let slug = existing.slug;
    if (dto.slug) {
      slug = slugify(dto.slug);
    } else if (dto.name && dto.name !== existing.name) {
      slug = await this.generateUniqueSlug(dto.name, id);
    }

    if (dto.name || dto.slug) {
      const duplicate = await this.categoryRepo.findByNameOrSlug(
        dto.name || existing.name,
        slug,
        id,
      );
      if (duplicate) {
        throw new ConflictException('Tên danh mục hoặc slug đã được sử dụng bởi danh mục khác');
      }
    }

    return this.categoryRepo.update(id, {
      ...(dto.name && { name: dto.name.trim() }),
      ...(slug && { slug }),
      ...(dto.description !== undefined && { description: dto.description?.trim() }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      ...(dto.parentId !== undefined && {
        parent: dto.parentId ? { connect: { id: dto.parentId } } : { disconnect: true },
      }),
    });
  }

  /**
   * Ẩn hoặc hiển thị danh mục
   */
  async toggleStatus(id: string, isActive?: boolean) {
    const category = await this.findOne(id);
    const newStatus = isActive !== undefined ? isActive : !category.isActive;

    const updated = await this.categoryRepo.update(id, {
      isActive: newStatus,
    });

    return {
      message: `Đã ${newStatus ? 'hiển thị' : 'ẩn'} danh mục "${updated.name}" thành công`,
      category: updated,
    };
  }

  /**
   * Xóa danh mục an toàn (Chặn xóa nếu đang có sản phẩm hoặc danh mục con)
   */
  async remove(id: string) {
    const category = await this.findOne(id);

    const productCount = await this.categoryRepo.countProducts(id);
    if (productCount > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục "${category.name}" vì đang có ${productCount} sản phẩm liên kết. Vui lòng chuyển hoặc xóa sản phẩm trước.`,
      );
    }

    const childCount = await this.categoryRepo.countChildren(id);
    if (childCount > 0) {
      throw new BadRequestException(
        `Không thể xóa danh mục "${category.name}" vì đang có ${childCount} danh mục con trực thuộc. Vui lòng chuyển hoặc xóa danh mục con trước.`,
      );
    }

    await this.categoryRepo.delete(id);

    return {
      message: `Đã xóa danh mục "${category.name}" thành công`,
    };
  }
}
