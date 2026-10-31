import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto.js';
import { Public } from '../guards/public.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Quản lý Danh mục (Categories)')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả danh mục cà phê' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết 1 danh mục và các sản phẩm thuộc danh mục' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Post()
  @ApiOperation({ summary: 'Tạo danh mục mới (Admin, Staff)' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}

