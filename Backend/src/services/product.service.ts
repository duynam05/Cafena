import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository.js';
import { CreateProductDto, UpdateProductDto, QueryProductDto, BatchDeleteDto, BatchDuplicateDto } from '../dto/product.dto.js';
import { PaginatedResult } from '../dto/pagination.dto.js';
import { calculatePagination } from '../utils/pagination.util.js';
import { ExcelUtil } from '../utils/excel.util.js';
import { XmlUtil } from '../utils/xml.util.js';
import { Product, Prisma } from '@prisma/client';

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
   * Chức năng 2: Thêm mới sản phẩm
   */
  async create(dto: CreateProductDto): Promise<Product> {
    const ProductID = dto.ProductID?.trim() || (await this.generateProductId());

    const existing = await this.productRepo.findById(ProductID);
    if (existing) {
      throw new ConflictException(`Mã sản phẩm ${ProductID} đã tồn tại trong hệ thống`);
    }

    return this.productRepo.create({
      ProductID,
      ProductName: dto.ProductName,
      PathImage: dto.PathImage,
      ProductType: dto.ProductType,
      Quantity: dto.Quantity ?? 0,
      Unit: dto.Unit ?? 'gói',
      Price: dto.Price,
      Description: dto.Description,
      roastLevel: dto.roastLevel,
      flavorNotes: dto.flavorNotes,
      origin: dto.origin,
      category: dto.categoryId ? { connect: { id: dto.categoryId } } : undefined,
    });
  }

  /**
   * Chức năng 1 & 6: Hiển thị bảng phân trang (10-15 item/page) + Tìm kiếm theo Tên, mô tả, mã...
   */
  async findAll(query: QueryProductDto): Promise<PaginatedResult<Product>> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // Tìm kiếm đa trường: ProductID, ProductName, Description, ProductType
    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { ProductID: { contains: term, mode: 'insensitive' } },
        { ProductName: { contains: term, mode: 'insensitive' } },
        { Description: { contains: term, mode: 'insensitive' } },
        { ProductType: { contains: term, mode: 'insensitive' } },
      ];
    }

    // Lọc theo loại sản phẩm
    if (query.productType && query.productType.trim()) {
      where.ProductType = { equals: query.productType.trim(), mode: 'insensitive' };
    }

    // Lọc theo danh mục
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Lọc theo khoảng giá
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.Price = {};
      if (query.minPrice !== undefined) where.Price.gte = Number(query.minPrice);
      if (query.maxPrice !== undefined) where.Price.lte = Number(query.maxPrice);
    }

    // Sắp xếp
    const validSortFields = ['CreateDate', 'UpdateDate', 'Price', 'Quantity', 'ProductName'];
    const sortBy = validSortFields.includes(query.sortBy || '') ? query.sortBy! : 'CreateDate';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    const [totalItems, items] = await Promise.all([
      this.productRepo.count(where),
      this.productRepo.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
    ]);

    return {
      items,
      meta: calculatePagination(totalItems, page, limit),
    };
  }

  /**
   * Chức năng 4: Xem chi tiết sản phẩm
   */
  async findOne(ProductID: string): Promise<Product> {
    const product = await this.productRepo.findById(ProductID);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với mã: ${ProductID}`);
    }
    return product;
  }

  /**
   * Chức năng 3: Cập nhật sản phẩm
   */
  async update(ProductID: string, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(ProductID);

    return this.productRepo.update(ProductID, {
      ...(dto.ProductName !== undefined && { ProductName: dto.ProductName }),
      ...(dto.PathImage !== undefined && { PathImage: dto.PathImage }),
      ...(dto.ProductType !== undefined && { ProductType: dto.ProductType }),
      ...(dto.Quantity !== undefined && { Quantity: dto.Quantity }),
      ...(dto.Unit !== undefined && { Unit: dto.Unit }),
      ...(dto.Price !== undefined && { Price: dto.Price }),
      ...(dto.Description !== undefined && { Description: dto.Description }),
      ...(dto.roastLevel !== undefined && { roastLevel: dto.roastLevel }),
      ...(dto.flavorNotes !== undefined && { flavorNotes: dto.flavorNotes }),
      ...(dto.origin !== undefined && { origin: dto.origin }),
      ...(dto.categoryId !== undefined && {
        category: dto.categoryId ? { connect: { id: dto.categoryId } } : { disconnect: true },
      }),
    });
  }

  /**
   * Chức năng 5a: Xóa 1 bản ghi được chọn
   */
  async remove(ProductID: string): Promise<{ message: string; ProductID: string }> {
    await this.findOne(ProductID);
    await this.productRepo.delete(ProductID);
    return { message: `Đã xóa thành công sản phẩm ${ProductID}`, ProductID };
  }

  /**
   * Chức năng 5b: Xóa nhiều bản ghi được chọn từ ô checkbox
   */
  async batchDelete(dto: BatchDeleteDto): Promise<{ message: string; deletedCount: number }> {
    if (!dto.ids || dto.ids.length === 0) {
      throw new BadRequestException('Danh sách mã sản phẩm xóa không được rỗng');
    }
    const count = await this.productRepo.deleteMany(dto.ids);
    return {
      message: `Đã xóa thành công ${count} sản phẩm được chọn`,
      deletedCount: count,
    };
  }

  /**
   * Chức năng 7: Sao chép 1 bản ghi
   */
  async duplicate(ProductID: string): Promise<Product> {
    const original = await this.findOne(ProductID);
    const newProductID = await this.generateProductId();

    return this.productRepo.create({
      ProductID: newProductID,
      ProductName: `${original.ProductName} (Bản sao)`,
      PathImage: original.PathImage,
      ProductType: original.ProductType,
      Quantity: original.Quantity,
      Unit: original.Unit,
      Price: original.Price,
      Description: original.Description,
      roastLevel: original.roastLevel,
      flavorNotes: original.flavorNotes,
      origin: original.origin,
      category: original.categoryId ? { connect: { id: original.categoryId } } : undefined,
    });
  }

  /**
   * Chức năng 8: Sao chép nhiều bản ghi
   */
  async batchDuplicate(dto: BatchDuplicateDto): Promise<{ message: string; duplicated: Product[] }> {
    if (!dto.ids || dto.ids.length === 0) {
      throw new BadRequestException('Danh sách mã sản phẩm sao chép không được rỗng');
    }

    const originals = await this.productRepo.findByIds(dto.ids);
    const results: Product[] = [];

    for (const original of originals) {
      const newProductID = await this.generateProductId();
      const dup = await this.productRepo.create({
        ProductID: newProductID,
        ProductName: `${original.ProductName} (Bản sao)`,
        PathImage: original.PathImage,
        ProductType: original.ProductType,
        Quantity: original.Quantity,
        Unit: original.Unit,
        Price: original.Price,
        Description: original.Description,
        roastLevel: original.roastLevel,
        flavorNotes: original.flavorNotes,
        origin: original.origin,
        category: original.categoryId ? { connect: { id: original.categoryId } } : undefined,
      });
      results.push(dup);
    }

    return {
      message: `Đã sao chép thành công ${results.length} sản phẩm`,
      duplicated: results,
    };
  }

  /**
   * Chức năng 9a: Xuất dữ liệu Excel (.xlsx)
   */
  async exportExcel(): Promise<Buffer> {
    const products = await this.productRepo.findAllForExport();
    return ExcelUtil.exportProducts(products);
  }

  /**
   * Chức năng 9b: Nhập dữ liệu từ Excel (.xlsx)
   */
  async importExcel(fileBuffer: Buffer) {
    try {
      const items = await ExcelUtil.parseProducts(fileBuffer);
      return this.upsertBatchProducts(items);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  /**
   * Chức năng 9c: Xuất dữ liệu JSON
   */
  async exportJson() {
    return this.productRepo.findAllForExport();
  }

  /**
   * Chức năng 9d: Nhập dữ liệu JSON
   */
  async importJson(items: any[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Dữ liệu JSON phải là một mảng các sản phẩm');
    }
    return this.upsertBatchProducts(items);
  }

  /**
   * Chức năng 9e: Xuất dữ liệu XML
   */
  async exportXml(): Promise<string> {
    const products = await this.productRepo.findAllForExport();
    return XmlUtil.exportProducts(products);
  }

  /**
   * Chức năng 9f: Nhập dữ liệu XML
   */
  async importXml(xmlContent: string) {
    try {
      const items = await XmlUtil.parseProducts(xmlContent);
      return this.upsertBatchProducts(items);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  /**
   * Helper: Cập nhật hoặc thêm mới hàng loạt sản phẩm khi import
   */
  private async upsertBatchProducts(items: any[]) {
    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const ProductID = item.ProductID?.trim() || (await this.generateProductId());
        await this.productRepo.upsert({
          ProductID,
          ProductName: item.ProductName || `Sản phẩm ${ProductID}`,
          PathImage: item.PathImage || null,
          ProductType: item.ProductType || 'Cà phê',
          Quantity: Number(item.Quantity) >= 0 ? Number(item.Quantity) : 0,
          Unit: item.Unit || 'gói',
          Price: Number(item.Price) >= 0 ? Number(item.Price) : 0,
          Description: item.Description || null,
          roastLevel: item.roastLevel || null,
          flavorNotes: item.flavorNotes || null,
          origin: item.origin || null,
        });
        successCount++;
      } catch (err) {
        errors.push(`Dòng ${i + 1}: ${(err as Error).message}`);
      }
    }

    return {
      message: `Nhập dữ liệu hoàn tất: Thành công ${successCount}/${items.length} dòng`,
      total: items.length,
      successCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
