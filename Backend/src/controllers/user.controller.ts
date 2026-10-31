import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service.js';
import { UpdateUserDto } from '../dto/user.dto.js';
import { Roles } from '../guards/roles.decorator.js';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@ApiTags('Quản lý Người dùng (Users - Admin only)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng hệ thống' })
  @ApiQuery({ name: 'role', enum: Role, required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(
    @Query('role') role?: Role,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userService.findAll(role, Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết thông tin người dùng theo ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin/vai trò/trạng thái người dùng' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}

