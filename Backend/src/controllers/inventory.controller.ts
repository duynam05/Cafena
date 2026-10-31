import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InventoryService } from '../services/inventory.service.js';
import { AdjustInventoryDto } from '../dto/inventory.dto.js';
import { CurrentUser } from '../guards/current-user.decorator.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Quản lý Kho & Tồn kho (Inventory)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Tổng quan tồn kho & danh sách các mặt hàng sắp hết' })
  getStockOverview() {
    return this.inventoryService.getStockOverview();
  }

  @Get('logs')
  @ApiOperation({ summary: 'Xem lịch sử biến động xuất/nhập kho hàng' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getInventoryLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.inventoryService.getInventoryLogs(Number(page), Number(limit));
  }

  @Post('adjust')
  @ApiOperation({ summary: 'Điều chỉnh kho thủ công (Nhập kho thêm, Xuất hủy, Kiểm kê)' })
  adjustStock(
    @CurrentUser('id') userId: string,
    @Body() dto: AdjustInventoryDto,
  ) {
    return this.inventoryService.adjustStock(userId, dto);
  }
}

