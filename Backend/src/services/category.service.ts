import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository.js';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto.js';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || slugify(dto.name);
    const existing = await this.categoryRepo.findByNameOrSlug(dto.name, slug);

    if (existing) {
      throw new ConflictException('Danh mục hoặc đường dẫn (slug) đã tồn tại');
    }

    return this.categoryRepo.create({
      name: dto.name,
      slug,
      description: dto.description,
    });
  }

  async findAll() {
    return this.categoryRepo.findAll();
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findById(id);

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const slug = dto.slug || (dto.name ? slugify(dto.name) : undefined);

    return this.categoryRepo.update(id, {
      ...(dto.name && { name: dto.name }),
      ...(slug && { slug }),
      ...(dto.description !== undefined && { description: dto.description }),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.categoryRepo.delete(id);
  }
}

