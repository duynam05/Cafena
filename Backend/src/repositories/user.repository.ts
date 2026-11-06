import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { Prisma, User, Role, Address } from '@prisma/client';

export type SafeUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
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

  async findByIdWithAddresses(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        },
      },
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
        avatar: true,
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

  // --- ADDRESS REPOSITORY METHODS ---

  async findAddressesByUserId(userId: string): Promise<Address[]> {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findAddressById(id: string, userId: string): Promise<Address | null> {
    return this.prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async createAddress(userId: string, data: Prisma.AddressCreateWithoutUserInput): Promise<Address> {
    // Nếu đặt là mặc định, hủy mặc định các địa chỉ khác
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async updateAddress(
    id: string,
    userId: string,
    data: Prisma.AddressUpdateWithoutUserInput,
  ): Promise<Address> {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true, NOT: { id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async deleteAddress(id: string): Promise<Address> {
    return this.prisma.address.delete({
      where: { id },
    });
  }

  async setDefaultAddress(id: string, userId: string): Promise<Address> {
    // 1. Reset all addresses of user
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // 2. Set this one as default
    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  async countAddresses(userId: string): Promise<number> {
    return this.prisma.address.count({ where: { userId } });
  }
}
