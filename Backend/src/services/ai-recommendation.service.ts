import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository.js';
import { RecommendationQueryDto } from '../dto/ai-recommendation.dto.js';
import { Product } from '@prisma/client';

export interface RecommendedItem {
  product: Product;
  matchScore: number; // 0 - 100%
  reasons: string[];
}

@Injectable()
export class AiRecommendationService {
  private readonly logger = new Logger(AiRecommendationService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private readonly productRepo: ProductRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>(
      'AI_SERVICE_URL',
      'http://127.0.0.1:8000',
    );
  }

  /**
   * Gợi ý sản phẩm thông minh dựa trên sở thích và đặc trưng sản phẩm
   */
  async getRecommendations(dto: RecommendationQueryDto): Promise<{
    strategy: 'fastapi-ml' | 'content-based-fallback';
    total: number;
    recommendations: RecommendedItem[];
  }> {
    const products = await this.productRepo.findMany({});

    if (products.length === 0) {
      return {
        strategy: 'content-based-fallback',
        total: 0,
        recommendations: [],
      };
    }

    // 1. Thử gọi sang FastAPI Microservice nếu đang hoạt động
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/v1/recommend`,
          {
            preferences: {
              preferredFlavors: dto.preferredFlavors,
              preferredRoast: dto.preferredRoast,
              preferredType: dto.preferredType,
              budgetMin: dto.budgetMin,
              budgetMax: dto.budgetMax,
            },
            products: products.map((p) => ({
              id: p.ProductID,
              name: p.ProductName,
              price: p.Price,
              roastLevel: p.roastLevel,
              flavorNotes: p.flavorNotes,
              type: p.ProductType,
              origin: p.origin,
              description: p.Description,
            })),
            limit: dto.limit || 6,
          },
          { timeout: 3000 },
        ),
      );

      if (response.data && Array.isArray(response.data.recommendations)) {
        const enriched = response.data.recommendations
          .map((rec: any) => {
            const product = products.find((p) => p.ProductID === rec.id);
            if (!product) return null;
            return {
              product,
              matchScore: Math.round(rec.score * 100),
              reasons: rec.reasons || ['Phù hợp với gu thưởng thức cà phê của bạn'],
            };
          })
          .filter(Boolean) as RecommendedItem[];

        return {
          strategy: 'fastapi-ml',
          total: enriched.length,
          recommendations: enriched,
        };
      }
    } catch (err: any) {
      this.logger.debug(
        `FastAPI AI service not available at ${this.aiServiceUrl} (${err.message}). Using built-in content-based fallback.`,
      );
    }

    // 2. Dự phòng: Thuật toán Heuristic Content-based filtering
    const scoredList: RecommendedItem[] = [];

    const targetFlavors = (dto.preferredFlavors || '')
      .toLowerCase()
      .split(/[,\s]+/)
      .filter((w) => w.length > 2);

    for (const p of products) {
      let score = 30;
      const reasons: string[] = [];

      // Khớp mức giá
      if (dto.budgetMin !== undefined && p.Price < dto.budgetMin) {
        score -= 20;
      } else if (dto.budgetMax !== undefined && p.Price > dto.budgetMax) {
        score -= 25;
      } else if (dto.budgetMin !== undefined || dto.budgetMax !== undefined) {
        score += 20;
        reasons.push(`Mức giá ${p.Price.toLocaleString('vi-VN')}đ nằm trong ngân sách mong muốn`);
      }

      // Khớp độ rang (Roast Level)
      if (dto.preferredRoast && p.roastLevel) {
        if (p.roastLevel.toLowerCase().includes(dto.preferredRoast.toLowerCase())) {
          score += 25;
          reasons.push(`Độ rang "${p.roastLevel}" đúng chuẩn gu thưởng thức của bạn`);
        }
      }

      // Khớp loại sản phẩm (Product Type)
      if (dto.preferredType && p.ProductType) {
        if (p.ProductType.toLowerCase().includes(dto.preferredType.toLowerCase())) {
          score += 15;
          reasons.push(`Sản phẩm thuộc dòng "${p.ProductType}" bạn đang tìm`);
        }
      }

      // Khớp hương vị (Flavor Notes / Description)
      if (targetFlavors.length > 0) {
        const textToAnalyze = `${p.flavorNotes || ''} ${p.Description || ''} ${p.ProductName}`.toLowerCase();
        const matchedKeywords: string[] = [];
        for (const kw of targetFlavors) {
          if (textToAnalyze.includes(kw)) {
            matchedKeywords.push(kw);
          }
        }
        if (matchedKeywords.length > 0) {
          const flavorBoost = Math.min(30, matchedKeywords.length * 15);
          score += flavorBoost;
          reasons.push(`Có chứa các nốt hương yêu thích: ${matchedKeywords.join(', ')}`);
        }
      }

      // Sản phẩm có tồn kho ưu tiên hiển thị
      if (p.Quantity > 0) {
        score += 5;
      }

      const matchScore = Math.min(99, Math.max(10, score));
      if (reasons.length === 0) {
        reasons.push('Sản phẩm chất lượng cao được cộng đồng yêu cà phê đánh giá tốt');
      }

      scoredList.push({
        product: p,
        matchScore,
        reasons,
      });
    }

    scoredList.sort((a, b) => b.matchScore - a.matchScore);

    const limit = dto.limit || 6;
    const finalItems = scoredList.slice(0, limit);

    return {
      strategy: 'content-based-fallback',
      total: finalItems.length,
      recommendations: finalItems,
    };
  }
}

