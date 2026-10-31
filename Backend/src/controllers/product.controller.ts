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
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service.js';
import { CreateProductDto, UpdateProductDto, QueryProductDto, BatchDeleteDto, BatchDuplicateDto } from '../dto/product.dto.js';
import { Public } from '../guards/public.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Quản lý Sản phẩm (Products)')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Chức năng 1 & 6: Lấy danh sách sản phẩm (Phân trang 10-15/trang, tìm kiếm đa tiêu chí)' })
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  // --- EXPORT ENDPOINTS (Chức năng 9) ---
  @Public()
  @Get('export/excel')
  @ApiOperation({ summary: 'Chức năng 9: Xuất danh sách sản phẩm ra tệp Excel (.xlsx)' })
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
  @ApiOperation({ summary: 'Chức năng 9: Xuất danh sách sản phẩm dạng JSON' })
  exportJson() {
    return this.productService.exportJson();
  }

  @Public()
  @Get('export/xml')
  @ApiOperation({ summary: 'Chức năng 9: Xuất danh sách sản phẩm dạng XML' })
  async exportXml(@Res() res: any) {
    const xml = await this.productService.exportXml();
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.xml`);
    return res.send(xml);
  }

  // --- IMPORT ENDPOINTS (Chức năng 9) ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('import/excel')
  @ApiOperation({ summary: 'Chức năng 9: Nhập sản phẩm từ tệp Excel (.xlsx) - Quản trị viên/Nhân viên' })
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
  @ApiOperation({ summary: 'Chức năng 9: Nhập sản phẩm từ định dạng JSON' })
  importJson(@Body() items: any[]) {
    return this.productService.importJson(items);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('import/xml')
  @ApiOperation({ summary: 'Chức năng 9: Nhập sản phẩm từ nội dung XML' })
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

  // --- BATCH ACTIONS (Chức năng 5 & 8) ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Post('batch-delete')
  @ApiOperation({ summary: 'Chức năng 5: Xóa nhiều sản phẩm bằng danh sách ProductID (hỗ trợ checkbox)' })
  batchDelete(@Body() dto: BatchDeleteDto) {
    return this.productService.batchDelete(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post('batch-duplicate')
  @ApiOperation({ summary: 'Chức năng 8: Sao chép nhiều bản ghi sản phẩm hàng loạt' })
  batchDuplicate(@Body() dto: BatchDuplicateDto) {
    return this.productService.batchDuplicate(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Chức năng 7: Sao chép 1 bản ghi sản phẩm và tự động cấp mã mới' })
  duplicate(@Param('id') id: string) {
    return this.productService.duplicate(id);
  }

  // --- STANDARD CRUD (Chức năng 2, 3, 4, 5a) ---
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Chức năng 4: Xem chi tiết 1 sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Chức năng 2: Thêm mới sản phẩm (Admin, Staff)' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Chức năng 3: Cập nhật sản phẩm' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Chức năng 5: Xóa 1 bản ghi sản phẩm' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}

