import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Cafena Coffee REST API is running successfully!';
  }
}

