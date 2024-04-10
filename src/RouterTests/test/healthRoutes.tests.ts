// src/Routers/test/healthRoutes.test.ts
import request from 'supertest';
import express from 'express';
import { healthRoutes } from '../../Routers';

// Set up an express app as the test subject
const app = express();
app.use(healthRoutes());

describe('Health Routes', () => {
  describe('GET /notification-health', () => {
    it('should return 200 OK and the health message', async () => {
      const response = await request(app).get('/notification-health');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Notification service is healthy and OK.');
    });
  });
});
