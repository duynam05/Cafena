import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from '../services/app.service.js';
import { Public } from '../guards/public.decorator.js';

@ApiTags('Hệ thống (System Health)')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Kiểm tra trạng thái hoạt động của hệ thống' })
  getHello(): { status: string; message: string; timestamp: string } {
    return {
      status: 'OK',
      message: this.appService.getHello(),
      timestamp: new Date().toISOString(),
    };
  }
}

