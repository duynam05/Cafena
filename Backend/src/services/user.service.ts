import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.js';
import { PrismaService } from '../repositories/prisma.service.js';
import { UpdateUserDto } from '../dto/user.dto.js';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(role?: Role, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (role) {
      where.role = role;
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          address: true,
          role: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        createdAt: true,
        orders: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    return this.userRepo.update(id, dto);
  }
}

