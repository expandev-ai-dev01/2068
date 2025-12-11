/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as productImageController from '@/api/internal/product-image/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Init-Example routes - /api/internal/init-example
 */
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * Product-Image routes - /api/internal/product-image
 */
router.get('/product-image', productImageController.listHandler);
router.post('/product-image', productImageController.createHandler);
router.get('/product-image/:id', productImageController.getHandler);
router.put('/product-image/:id', productImageController.updateHandler);
router.delete('/product-image/:id', productImageController.deleteHandler);
router.patch('/product-image/:id/reorder', productImageController.reorderHandler);
router.patch('/product-image/:id/set-primary', productImageController.setPrimaryHandler);

export default router;
