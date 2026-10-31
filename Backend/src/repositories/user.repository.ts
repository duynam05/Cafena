import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Prisma, User, Role } from '@prisma/client';

export type SafeUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmailVerifyToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { emailVerifyToken: token },
    });
  }

  async findByResetPasswordToken(token: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { resetPasswordToken: token },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateRefreshToken(id: string, hashedRefreshToken: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { hashedRefreshToken },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
  }): Promise<SafeUser[]> {
    const { skip, take, where } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.UserWhereInput): Promise<number> {
    return this.prisma.user.count({ where });
  }
}
