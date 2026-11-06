import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository.js';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
  BatchDeleteDto,
  BatchDuplicateDto,
} from '../dto/product.dto.js';
import { PaginatedResult } from '../dto/pagination.dto.js';
import { calculatePagination } from '../utils/pagination.util.js';
import { ExcelUtil } from '../utils/excel.util.js';
import { XmlUtil } from '../utils/xml.util.js';
import { slugify } from '../utils/slug.util.js';
import { Product, Prisma } from '@prisma/client';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export function getProductStockStatus(quantity: number): StockStatus {
  if (quantity <= 0) return 'OUT_OF_STOCK';
  if (quantity <= 10) return 'LOW_STOCK';
  return 'IN_STOCK';
}

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  /**
   * Helper: Sinh mã sản phẩm tự động nếu người dùng không truyền vào (CF-0001, CF-0002...)
   */
  async generateProductId(): Promise<string> {
    const count = await this.productRepo.count();
    let candidate = `CF-${String(count + 1).padStart(4, '0')}`;
    let exists = await this.productRepo.findById(candidate);
    let increment = count + 2;
    while (exists) {
      candidate = `CF-${String(increment).padStart(4, '0')}`;
      exists = await this.productRepo.findById(candidate);
      increment++;
    }
    return candidate;
  }

  /**
   * Helper: Sinh slug SEO duy nhất từ tên sản phẩm
   */
  async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const baseSlug = slugify(name);
    let candidate = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.productRepo.findBySlug(candidate);
      if (!existing || (excludeId && existing.ProductID === excludeId)) {
        return candidate;
      }
      candidate = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Thêm mới sản phẩm
   */
  async create(dto: CreateProductDto): Promise<Product> {
    const ProductID = dto.ProductID?.trim() || (await this.generateProductId());

    const existing = await this.productRepo.findById(ProductID);
    if (existing) {
      throw new ConflictException(`Mã sản phẩm ${ProductID} đã tồn tại trong hệ thống`);
    }

    const slug = dto.slug ? slugify(dto.slug) : await this.generateUniqueSlug(dto.ProductName);

    return this.productRepo.create({
      ProductID,
      ProductName: dto.ProductName,
      slug,
      PathImage: dto.PathImage,
      images: dto.images || (dto.PathImage ? [dto.PathImage] : []),
      ProductType: dto.ProductType,
      Quantity: dto.Quantity ?? 0,
      Unit: dto.Unit ?? 'gói',
      Price: dto.Price,
      Description: dto.Description,
      isActive: dto.isActive ?? true,
      roastLevel: dto.roastLevel,
      flavorNotes: dto.flavorNotes,
      origin: dto.origin,
      isFeatured: dto.isFeatured ?? false,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
    });
  }

  /**
   * Lấy danh sách sản phẩm với bộ lọc toàn diện & phân trang
   */
  async findAll(query: QueryProductDto): Promise<PaginatedResult<any>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // 1. Tìm kiếm đa trường: Tên, Mô tả, Mã sản phẩm (ProductID), Loại sản phẩm
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { ProductID: { contains: term, mode: 'insensitive' } },
        { ProductName: { contains: term, mode: 'insensitive' } },
        { Description: { contains: term, mode: 'insensitive' } },
        { ProductType: { contains: term, mode: 'insensitive' } },
      ];
    }

    // 2. Lọc theo Loại sản phẩm
    if (query.productType && query.productType.trim()) {
      where.ProductType = { equals: query.productType.trim(), mode: 'insensitive' };
    }

    // 3. Lọc theo Danh mục (ID hoặc Slug danh mục)
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    } else if (query.categorySlug) {
      where.category = { slug: query.categorySlug.trim() };
    }

    // 4. Lọc theo Khoảng giá
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.Price = {};
      if (query.minPrice !== undefined) where.Price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.Price.lte = Number(query.maxPrice);
    }

    // 5. Lọc sản phẩm còn hàng
    if (query.inStockOnly) {
      where.Quantity = { gt: 0 };
    }

    // 6. Lọc theo Độ rang
    if (query.roastLevel && query.roastLevel.trim()) {
      where.roastLevel = { equals: query.roastLevel.trim(), mode: 'insensitive' };
    }

    // 7. Lọc theo Sản phẩm nổi bật
    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    // 8. Sắp xếp linh hoạt
    let orderBy: Prisma.ProductOrderByWithRelationInput = { CreateDate: 'desc' };

    const sortAlias = query.sortBy?.toLowerCase();
    if (sortAlias === 'price_asc' || (query.sortBy === 'Price' && query.sortOrder === 'asc')) {
      orderBy = { Price: 'asc' };
    } else if (sortAlias === 'price_desc' || (query.sortBy === 'Price' && query.sortOrder === 'desc')) {
      orderBy = { Price: 'desc' };
    } else if (sortAlias === 'newest') {
      orderBy = { CreateDate: 'desc' };
    } else if (sortAlias === 'oldest') {
      orderBy = { CreateDate: 'asc' };
    } else {
      const validSortFields = ['ProductID', 'ProductName', 'Price', 'Quantity', 'CreateDate', 'UpdateDate'];
      const field = validSortFields.includes(query.sortBy || '') ? query.sortBy! : 'CreateDate';
      const order = query.sortOrder === 'asc' ? 'asc' : 'desc';
      orderBy = { [field]: order };
    }

    const [total, rawProducts] = await Promise.all([
      this.productRepo.count(where),
      this.productRepo.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
    ]);

    // Bổ sung trạng thái tồn kho (stockStatus) và khả năng đặt mua (canOrder)
    const enrichedProducts = rawProducts.map((p) => ({
      ...p,
      stockStatus: getProductStockStatus(p.Quantity),
      canOrder: p.isActive && p.Quantity > 0,
    }));

    const paginationMeta = calculatePagination(total, page, limit);

    return {
      items: enrichedProducts,
      meta: paginationMeta,
    };
  }

  /**
   * Lấy chi tiết sản phẩm thông minh theo ID hoặc Slug SEO
   */
  async findOne(idOrSlug: string): Promise<any> {
    const product = await this.productRepo.findByIdOrSlug(idOrSlug);

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với mã hoặc đường dẫn "${idOrSlug}"`);
    }

    return {
      ...product,
      stockStatus: getProductStockStatus(product.Quantity),
      canOrder: product.isActive && product.Quantity > 0,
    };
  }

  /**
   * Kiểm tra tình trạng kinh doanh và tồn kho của sản phẩm
   */
  async getStockStatus(idOrSlug: string) {
    const product = await this.findOne(idOrSlug);

    return {
      ProductID: product.ProductID,
      ProductName: product.ProductName,
      slug: product.slug,
      Quantity: product.Quantity,
      Unit: product.Unit,
      Price: product.Price,
      isActive: product.isActive,
      stockStatus: product.stockStatus,
      canOrder: product.canOrder,
      message:
        !product.isActive
          ? 'Sản phẩm hiện đang tạm ngừng kinh doanh'
          : product.Quantity === 0
          ? 'Sản phẩm đã hết hàng trong kho'
          : product.Quantity <= 10
          ? `Sản phẩm sắp hết hàng (chỉ còn ${product.Quantity} ${product.Unit})`
          : 'Sản phẩm sẵn sàng phục vụ',
    };
  }

  /**
   * Lấy danh sách sản phẩm mới nhất
   */
  async getNewest(limit: number = 8) {
    const products = await this.productRepo.findNewest(limit);
    return products.map((p) => ({
      ...p,
      stockStatus: getProductStockStatus(p.Quantity),
      canOrder: p.isActive && p.Quantity > 0,
    }));
  }

  /**
   * Lấy danh sách sản phẩm nổi bật
   */
  async getFeatured(limit: number = 8) {
    const products = await this.productRepo.findFeatured(limit);
    return products.map((p) => ({
      ...p,
      stockStatus: getProductStockStatus(p.Quantity),
      canOrder: p.isActive && p.Quantity > 0,
    }));
  }

  /**
   * Lấy danh sách sản phẩm bán chạy nhất
   */
  async getBestSellers(limit: number = 8) {
    const products = await this.productRepo.findBestSellers(limit);
    return products.map((p) => ({
      ...p,
      stockStatus: getProductStockStatus(p.Quantity),
      canOrder: p.isActive && p.Quantity > 0,
    }));
  }

  /**
   * Lấy danh sách sản phẩm liên quan (ưu tiên cùng Category & cùng ProductType)
   */
  async getRelated(idOrSlug: string, limit: number = 4) {
    const product = await this.productRepo.findByIdOrSlug(idOrSlug);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm "${idOrSlug}"`);
    }

    const related = await this.productRepo.findRelated(product, limit);
    return related.map((p) => ({
      ...p,
      stockStatus: getProductStockStatus(p.Quantity),
      canOrder: p.isActive && p.Quantity > 0,
    }));
  }

  /**
   * Cập nhật thông tin sản phẩm
   */
  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ${id} để cập nhật`);
    }

    let slug = existing.slug;
    if (dto.slug) {
      slug = slugify(dto.slug);
    } else if (dto.ProductName && dto.ProductName !== existing.ProductName) {
      slug = await this.generateUniqueSlug(dto.ProductName, id);
    }

    return this.productRepo.update(id, {
      ProductName: dto.ProductName,
      slug,
      PathImage: dto.PathImage,
      images: dto.images,
      ProductType: dto.ProductType,
      Quantity: dto.Quantity,
      Unit: dto.Unit,
      Price: dto.Price,
      Description: dto.Description,
      isActive: dto.isActive,
      roastLevel: dto.roastLevel,
      flavorNotes: dto.flavorNotes,
      origin: dto.origin,
      isFeatured: dto.isFeatured,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
    });
  }

  /**
   * Xóa 1 sản phẩm
   */
  async remove(id: string): Promise<Product> {
    const existing = await this.productRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ${id} để xóa`);
    }
    return this.productRepo.delete(id);
  }

  /**
   * Xóa hàng loạt sản phẩm
   */
  async batchDelete(dto: BatchDeleteDto) {
    const count = await this.productRepo.deleteMany(dto.ids);
    return {
      message: `Đã xóa thành công ${count} sản phẩm khỏi hệ thống`,
      deletedCount: count,
      deletedIds: dto.ids,
    };
  }

  /**
   * Nhân bản 1 sản phẩm
   */
  async duplicate(id: string): Promise<Product> {
    const original = await this.productRepo.findById(id);
    if (!original) {
      throw new NotFoundException(`Không tìm thấy sản phẩm ${id} để sao chép`);
    }

    const newId = await this.generateProductId();
    const newName = `${original.ProductName} (Bản sao)`;
    const newSlug = await this.generateUniqueSlug(newName);

    return this.productRepo.create({
      ProductID: newId,
      ProductName: newName,
      slug: newSlug,
      PathImage: original.PathImage,
      images: original.images,
      ProductType: original.ProductType,
      Quantity: original.Quantity,
      Unit: original.Unit,
      Price: original.Price,
      Description: original.Description,
      isActive: original.isActive,
      roastLevel: original.roastLevel,
      flavorNotes: original.flavorNotes,
      origin: original.origin,
      isFeatured: false,
      category: original.categoryId ? { connect: { id: original.categoryId } } : undefined,
    });
  }

  /**
   * Nhân bản nhiều sản phẩm hàng loạt
   */
  async batchDuplicate(dto: BatchDuplicateDto) {
    const originals = await this.productRepo.findByIds(dto.ids);
    if (originals.length === 0) {
      throw new NotFoundException('Không tìm thấy sản phẩm nào trong danh sách sao chép');
    }

    const duplicates: Product[] = [];
    for (const item of originals) {
      const newId = await this.generateProductId();
      const newName = `${item.ProductName} (Bản sao)`;
      const newSlug = await this.generateUniqueSlug(newName);

      const duplicated = await this.productRepo.create({
        ProductID: newId,
        ProductName: newName,
        slug: newSlug,
        PathImage: item.PathImage,
        images: item.images,
        ProductType: item.ProductType,
        Quantity: item.Quantity,
        Unit: item.Unit,
        Price: item.Price,
        Description: item.Description,
        isActive: item.isActive,
        roastLevel: item.roastLevel,
        flavorNotes: item.flavorNotes,
        origin: item.origin,
        isFeatured: false,
        category: item.categoryId ? { connect: { id: item.categoryId } } : undefined,
      });
      duplicates.push(duplicated);
    }

    return {
      message: `Đã sao chép thành công ${duplicates.length} sản phẩm`,
      count: duplicates.length,
      data: duplicates,
    };
  }

  /**
   * Xuất dữ liệu Excel
   */
  async exportExcel(): Promise<Buffer> {
    const products = await this.productRepo.findAllForExport();
    return ExcelUtil.exportProducts(products);
  }

  /**
   * Nhập dữ liệu từ Excel
   */
  async importExcel(fileBuffer: Buffer) {
    const items = await ExcelUtil.parseProducts(fileBuffer);
    if (items.length === 0) {
      throw new BadRequestException('Tệp Excel không chứa dữ liệu sản phẩm hợp lệ');
    }
    return this.upsertBatchProducts(items);
  }

  /**
   * Xuất dữ liệu JSON
   */
  async exportJson(): Promise<any[]> {
    return this.productRepo.findAllForExport();
  }

  /**
   * Nhập dữ liệu JSON
   */
  async importJson(items: any[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Dữ liệu JSON phải là một mảng danh sách sản phẩm');
    }
    return this.upsertBatchProducts(items);
  }

  /**
   * Xuất dữ liệu XML
   */
  async exportXml(): Promise<string> {
    const products = await this.productRepo.findAllForExport();
    return XmlUtil.exportProducts(products);
  }

  /**
   * Nhập dữ liệu XML
   */
  async importXml(xmlContent: string) {
    const items = await XmlUtil.parseProducts(xmlContent);
    if (items.length === 0) {
      throw new BadRequestException('Nội dung XML không chứa thẻ <product> hợp lệ');
    }
    return this.upsertBatchProducts(items);
  }

  /**
   * Helper: Upsert hàng loạt khi nhập dữ liệu
   */
  private async upsertBatchProducts(items: any[]) {
    let successCount = 0;
    const errors: any[] = [];

    for (const item of items) {
      try {
        const ProductID = item.ProductID?.trim() || (await this.generateProductId());
        const slug = item.slug ? slugify(item.slug) : await this.generateUniqueSlug(item.ProductName, ProductID);

        await this.productRepo.upsert({
          ProductID,
          ProductName: item.ProductName,
          slug,
          PathImage: item.PathImage || null,
          images: item.images || (item.PathImage ? [item.PathImage] : []),
          ProductType: item.ProductType || 'Cà phê rang mộc',
          Quantity: Number(item.Quantity) || 0,
          Unit: item.Unit || 'gói',
          Price: Number(item.Price) || 0,
          Description: item.Description || null,
          isActive: item.isActive ?? true,
          roastLevel: item.roastLevel || null,
          flavorNotes: item.flavorNotes || null,
          origin: item.origin || null,
          isFeatured: item.isFeatured ?? false,
        });
        successCount++;
      } catch (err: any) {
        errors.push({ item, error: err.message });
      }
    }

    return {
      message: `Đã xử lý nhập thành công ${successCount}/${items.length} bản ghi`,
      successCount,
      failureCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
