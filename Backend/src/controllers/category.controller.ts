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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoryService } from '../services/category.service.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  QueryCategoryDto,
  CategoryProductQueryDto,
} from '../dto/category.dto.js';
import { Public } from '../guards/public.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Quản lý Danh mục (Categories)')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ==========================================
  // 1. TRUY VẤN PUBLIC (DANH SÁCH, CÂY, CHI TIẾT, SẢN PHẨM)
  // ==========================================

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách danh mục (Phân trang, tìm kiếm, lọc theo cha-con và trạng thái ẩn/hiện)',
  })
  findAll(@Query() query: QueryCategoryDto) {
    return this.categoryService.findAll(query);
  }

  @Public()
  @Get('tree')
  @ApiOperation({
    summary: 'Lấy cấu trúc cây danh mục đa cấp (Tree: Cha -> Con)',
    description: 'Trả về danh sách danh mục gốc kèm danh mục con lồng nhau phục vụ Menu điều hướng website.',
  })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean, example: false })
  getTree(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoryService.getTree(
      includeInactive === true || String(includeInactive) === 'true',
    );
  }

  @Public()
  @Get(':idOrSlug/products')
  @ApiOperation({
    summary: 'Lấy danh sách sản phẩm theo danh mục',
    description:
      'Lấy danh sách sản phẩm thuộc danh mục (tự động bao gồm cả sản phẩm của danh mục con trực thuộc nếu includeChildren=true), có phân trang và lọc theo giá, còn hàng.',
  })
  getProductsByCategory(
    @Param('idOrSlug') idOrSlug: string,
    @Query() query: CategoryProductQueryDto,
  ) {
    return this.categoryService.getProductsByCategory(idOrSlug, query);
  }

  @Public()
  @Get(':idOrSlug')
  @ApiOperation({
    summary: 'Xem chi tiết 1 danh mục theo ID hoặc Slug SEO',
    description: 'Endpoint thông minh: tự động nhận diện nếu client truyền ID (UUID) hoặc Slug SEO (ví dụ: ca-phe-arabica).',
  })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.categoryService.findOne(idOrSlug);
  }

  // ==========================================
  // 2. QUẢN TRỊ DANH MỤC (ADMIN & STAFF)
  // ==========================================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({
    summary: 'Tạo danh mục mới (Admin, Staff)',
    description: 'Có thể thiết lập danh mục cha (parentId) để tạo danh mục con.',
  })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục (Admin, Staff)' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/status')
  @ApiOperation({
    summary: 'Ẩn hoặc hiển thị danh mục (Admin, Staff)',
    description: 'Bật/tắt trạng thái isActive của danh mục.',
  })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  toggleStatus(
    @Param('id') id: string,
    @Query('isActive') isActive?: boolean,
  ) {
    const activeBool =
      isActive !== undefined ? isActive === true || String(isActive) === 'true' : undefined;
    return this.categoryService.toggleStatus(id, activeBool);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa danh mục an toàn (Admin)',
    description: 'Chặn xóa nếu danh mục đang có sản phẩm hoặc có danh mục con trực thuộc.',
  })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
