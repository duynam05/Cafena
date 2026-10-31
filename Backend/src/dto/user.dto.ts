import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '456 Lê Lợi, TP.HCM' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: Role, example: Role.STAFF })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

