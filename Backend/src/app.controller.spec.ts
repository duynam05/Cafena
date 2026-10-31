import { describe, it, expect } from 'vitest';
import { AppController } from './controllers/app.controller.js';
import { AppService } from './services/app.service.js';

describe('AppController', () => {
  it('should return health status', () => {
    const service = new AppService();
    const controller = new AppController(service);
    const result = controller.getHello();
    expect(result.status).toBe('OK');
    expect(result.message).toContain('Cafena');
  });
});
