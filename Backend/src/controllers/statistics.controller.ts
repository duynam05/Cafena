import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from '../services/statistics.service.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Thống kê & Báo cáo Doanh thu (Statistics)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Thống kê tổng quan: Doanh thu, số đơn, số khách hàng, số sản phẩm' })
  getOverview() {
    return this.statisticsService.getDashboardSummary();
  }

  @Get('top-selling')
  @ApiOperation({ summary: 'Top sản phẩm bán chạy nhất' })
  @ApiQuery({ name: 'limit', required: false, example: 5 })
  getTopSelling(@Query('limit') limit: number = 5) {
    return this.statisticsService.getTopSellingProducts(Number(limit));
  }

  @Get('revenue-recent')
  @ApiOperation({ summary: 'Doanh thu 7 ngày gần nhất phục vụ vẽ biểu đồ' })
  getRecentRevenue() {
    return this.statisticsService.getRecentRevenue();
  }
}

