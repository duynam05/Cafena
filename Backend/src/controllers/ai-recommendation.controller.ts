import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiRecommendationService } from '../services/ai-recommendation.service.js';
import { RecommendationQueryDto } from '../dto/ai-recommendation.dto.js';
import { Public } from '../guards/public.decorator.js';

@ApiTags('Gợi ý Trí tuệ Nhân tạo (AI Recommendation)')
@Controller('ai-recommendation')
export class AiRecommendationController {
  constructor(private readonly aiRecommendationService: AiRecommendationService) {}

  @Public()
  @Get('products')
  @ApiOperation({
    summary: 'Gợi ý sản phẩm thông minh bằng AI / Content-based Filtering theo sở thích khách hàng',
  })
  recommend(@Query() query: RecommendationQueryDto) {
    return this.aiRecommendationService.getRecommendations(query);
  }
}

