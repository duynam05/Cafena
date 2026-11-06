import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service.js';
import {
  CreateProductDto,
  UpdateProductDto,
  QueryProductDto,
  ProductCollectionQueryDto,
  BatchDeleteDto,
  BatchDuplicateDto,
} from '../dto/product.dto.js';
import { Public } from '../guards/public.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Quản lý & Hiển thị Sản phẩm (Products)')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ==========================================
  // 1. TRUY VẤN DANH SÁCH & BỘ SƯU TẬP (PUBLIC)
  // ==========================================

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm (Phân trang 10-15/trang, tìm kiếm đa trường & bộ lọc toàn diện)',
    description:
      'Hỗ trợ tìm kiếm theo tên, mã, mô tả; lọc theo danh mục, loại sản phẩm, khoảng giá, độ rang, tình trạng còn hàng (inStockOnly); sắp xếp theo giá, ngày tạo, bán chạy.',
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Public()
  @Get('collection/newest')
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm mới nhất',
    description: 'Lấy top N sản phẩm mới ra mắt được sắp xếp theo ngày tạo gần nhất.',
  })
  getNewest(@Query() query: ProductCollectionQueryDto) {
    return this.productService.getNewest(Number(query.limit) || 8);
  }

  @Public()
  @Get('collection/featured')
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm nổi bật',
    description: 'Lấy danh sách các sản phẩm tiêu biểu được gắn cờ isFeatured = true.',
  })
  getFeatured(@Query() query: ProductCollectionQueryDto) {
    return this.productService.getFeatured(Number(query.limit) || 8);
  }

  @Public()
  @Get('collection/best-sellers')
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm bán chạy nhất',
    description: 'Lấy top N sản phẩm có số lượng bán nhiều nhất từ các đơn hàng thực tế.',
  })
  getBestSellers(@Query() query: ProductCollectionQueryDto) {
    return this.productService.getBestSellers(Number(query.limit) || 8);
  }

  // ==========================================
  // 2. XUẤT DỮ LIỆU ĐA ĐỊNH DẠNG (EXPORT)
  // ==========================================

  @Public()
  @Get('export/excel')
  @ApiOperation({ summary: 'Xuất danh sách sản phẩm ra tệp Excel (.xlsx)' })
  async exportExcel(@Res() res: any) {
    const buffer = await this.productService.exportExcel();
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=products_${Date.now()}.xlsx`,
    );
    return res.end(buffer);
  }

  @Public()
  @Get('export/json')
  @ApiOperation({ summary: 'Xuất danh sách sản phẩm dạng JSON' })
  exportJson() {
    return this.productService.exportJson();
  }

  @Public()
  @Get('export/xml')
  @ApiOperation({ summary: 'Xuất danh sách sản phẩm dạng XML' })
  async exportXml(@Res() res: any) {
    const xml = await this.productService.exportXml();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.xml`);
    return res.send(xml);
  }

  // ==========================================
  // 3. NHẬP DỮ LIỆU ĐA ĐỊNH DẠNG (IMPORT)
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('import/excel')
  @ApiOperation({ summary: 'Nhập sản phẩm từ tệp Excel (.xlsx) - Quản trị viên/Nhân viên' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp Excel để tải lên');
    }
    return this.productService.importExcel(file.buffer);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('import/json')
  @ApiOperation({ summary: 'Nhập sản phẩm từ định dạng JSON' })
  importJson(@Body() items: any[]) {
    return this.productService.importJson(items);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('import/xml')
  @ApiOperation({ summary: 'Nhập sản phẩm từ nội dung XML' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        xmlContent: {
          type: 'string',
          example:
            '<products><product><ProductName>Cà phê Robusta Đắk Lắk</ProductName><ProductType>Cà phê bột</ProductType><Price>120000</Price><Quantity>50</Quantity></product></products>',
        },
      },
    },
  })
  importXml(@Body('xmlContent') xmlContent: string) {
    if (!xmlContent) {
      throw new BadRequestException('Trường xmlContent không được để trống');
    }
    return this.productService.importXml(xmlContent);
  }

  // ==========================================
  // 4. THAO TÁC HÀNG LOẠT (BATCH ACTIONS)
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Post('batch-delete')
  @ApiOperation({ summary: 'Xóa nhiều sản phẩm bằng danh sách ProductID (hỗ trợ checkbox)' })
  batchDelete(@Body() dto: BatchDeleteDto) {
    return this.productService.batchDelete(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('batch-duplicate')
  @ApiOperation({ summary: 'Sao chép nhiều bản ghi sản phẩm hàng loạt' })
  batchDuplicate(@Body() dto: BatchDuplicateDto) {
    return this.productService.batchDuplicate(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Sao chép 1 bản ghi sản phẩm và tự động cấp mã mới' })
  duplicate(@Param('id') id: string) {
    return this.productService.duplicate(id);
  }

  // ==========================================
  // 5. TRUY VẤN CHI TIẾT & SẢN PHẨM LIÊN QUAN
  // ==========================================

  @Public()
  @Get(':idOrSlug/related')
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm liên quan',
    description: 'Gợi ý các sản phẩm cùng danh mục hoặc cùng loại sản phẩm, loại trừ sản phẩm hiện tại.',
  })
  @ApiQuery({ name: 'limit', required: false, example: 4 })
  getRelated(
    @Param('idOrSlug') idOrSlug: string,
    @Query('limit') limit?: number,
  ) {
    return this.productService.getRelated(idOrSlug, Number(limit) || 4);
  }

  @Public()
  @Get(':idOrSlug/stock-status')
  @ApiOperation({
    summary: 'Kiểm tra tình trạng kinh doanh và tồn kho của sản phẩm',
    description: 'Trả về trạng thái hoạt động (isActive), số lượng tồn, trạng thái tồn kho (IN_STOCK, LOW_STOCK, OUT_OF_STOCK) và cờ canOrder.',
  })
  getStockStatus(@Param('idOrSlug') idOrSlug: string) {
    return this.productService.getStockStatus(idOrSlug);
  }

  @Public()
  @Get(':idOrSlug')
  @ApiOperation({
    summary: 'Lấy chi tiết sản phẩm theo ID hoặc Slug SEO',
    description: 'Endpoint thông minh: tự động nhận diện nếu truyền mã ProductID (ví dụ CF-0001) hoặc Slug (ví dụ arabica-cau-dat).',
  })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.productService.findOne(idOrSlug);
  }

  // ==========================================
  // 6. QUẢN LÝ CRUD SẢN PHẨM (ADMIN & STAFF)
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Thêm mới sản phẩm (Admin, Staff)' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm (Admin, Staff)' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa 1 bản ghi sản phẩm (Admin)' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
