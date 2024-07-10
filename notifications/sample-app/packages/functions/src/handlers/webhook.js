import App from 'koa';
import createErrorHandler from '../middleware/errorHandler';
import * as errorService from '../services/errorService';
import getRoutes from '../routes/api';
import render from 'koa-ejs';
import path from 'path';
import webhookRouter from '@functions/routes/webHook';
const cors = require('@koa/cors');

// Initialize all demand configuration for an application
const api = new App();
api.proxy = true;
render(api, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});
api.use(cors());

// Register all routes for the application
const router = webhookRouter('/webhookApi');
api.use(router.allowedMethods());
api.use(router.routes());
// Handling all errors
api.on('error', errorService.handleError);

export default api;
