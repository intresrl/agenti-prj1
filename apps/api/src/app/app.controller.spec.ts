import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getData', () => {
    it('should return a message', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({
        message: 'Welcome to Food Cost SaaS API!',
      });
    });
  });

  describe('healthCheck', () => {
    it('should return health status', () => {
      const appController = app.get<AppController>(AppController);
      const health = appController.healthCheck();
      expect(health.status).toBe('ok');
      expect(health.service).toBe('Food Cost SaaS API');
    });
  });
});
