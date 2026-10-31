import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.service.js';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Thống kê tổng quan: Doanh thu, số lượng đơn hàng, số khách hàng, số sản phẩm
   */
  async getDashboardSummary() {
    const [
      totalOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
      revenueResult,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.COMPLETED } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.product.count(),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.COMPLETED },
        _sum: { totalAmount: true },
      }),
    ]);

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      totalCustomers,
      totalProducts,
    };
  }

  /**
   * Top sản phẩm bán chạy nhất
   */
  async getTopSellingProducts(limit: number = 5) {
    const topItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    const productIds = topItems.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { ProductID: { in: productIds } },
    });

    return topItems.map((item) => {
      const prod = products.find((p) => p.ProductID === item.productId);
      return {
        productId: item.productId,
        productName: prod?.ProductName || 'Không xác định',
        pathImage: prod?.PathImage || null,
        price: prod?.Price || 0,
        totalSold: item._sum.quantity || 0,
      };
    });
  }

  /**
   * Thống kê doanh thu theo 7 ngày gần nhất
   */
  async getRecentRevenue() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.COMPLETED,
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        totalAmount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const revenueByDay: Record<string, number> = {};
    orders.forEach((o) => {
      const day = o.createdAt.toISOString().slice(0, 10);
      revenueByDay[day] = (revenueByDay[day] || 0) + o.totalAmount;
    });

    return Object.entries(revenueByDay).map(([date, revenue]) => ({
      date,
      revenue,
    }));
  }
}

