/**
 * @summary
 * API controller for Product Image Gallery entity.
 * Handles image management operations for product catalog.
 *
 * @module api/internal/product-image/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  productImageCreate,
  productImageList,
  productImageGet,
  productImageUpdate,
  productImageDelete,
  productImageReorder,
  productImageSetPrimary,
} from '@/services/productImage';

/**
 * @api {get} /api/internal/product-image List Product Images
 * @apiName ListProductImages
 * @apiGroup ProductImage
 *
 * @apiQuery {Number} [productId] Filter by product ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of product images
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.productId Product identifier
 * @apiSuccess {String} data.url Image URL
 * @apiSuccess {String|null} data.caption Image caption
 * @apiSuccess {Boolean} data.isPrimary Primary image flag
 * @apiSuccess {Number} data.displayOrder Display order
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
    const data = await productImageList(productId);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/product-image Create Product Image
 * @apiName CreateProductImage
 * @apiGroup ProductImage
 *
 * @apiBody {Number} productId Product identifier
 * @apiBody {String} url Image URL (max 500 chars)
 * @apiBody {String|null} [caption] Image caption (max 150 chars)
 * @apiBody {Boolean} [isPrimary] Set as primary image
 * @apiBody {Number} [displayOrder] Display order
 * @apiBody {Number} [width] Image width in pixels
 * @apiBody {Number} [height] Image height in pixels
 * @apiBody {Number} [rotation] Rotation angle (0, 90, 180, 270)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.productId Product identifier
 * @apiSuccess {String} data.url Image URL
 * @apiSuccess {String|null} data.caption Image caption
 * @apiSuccess {Boolean} data.isPrimary Primary image flag
 * @apiSuccess {Number} data.displayOrder Display order
 * @apiSuccess {Number} data.width Image width
 * @apiSuccess {Number} data.height Image height
 * @apiSuccess {Number} data.rotation Rotation angle
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productImageCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/product-image/:id Get Product Image
 * @apiName GetProductImage
 * @apiGroup ProductImage
 *
 * @apiParam {Number} id Product image ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.productId Product identifier
 * @apiSuccess {String} data.url Image URL
 * @apiSuccess {String|null} data.caption Image caption
 * @apiSuccess {Boolean} data.isPrimary Primary image flag
 * @apiSuccess {Number} data.displayOrder Display order
 * @apiSuccess {Number} data.width Image width
 * @apiSuccess {Number} data.height Image height
 * @apiSuccess {Number} data.rotation Rotation angle
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await productImageGet(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/product-image/:id Update Product Image
 * @apiName UpdateProductImage
 * @apiGroup ProductImage
 *
 * @apiParam {Number} id Product image ID
 *
 * @apiBody {String} url Image URL (max 500 chars)
 * @apiBody {String|null} [caption] Image caption (max 150 chars)
 * @apiBody {Boolean} [isPrimary] Set as primary image
 * @apiBody {Number} [displayOrder] Display order
 * @apiBody {Number} [width] Image width in pixels
 * @apiBody {Number} [height] Image height in pixels
 * @apiBody {Number} [rotation] Rotation angle (0, 90, 180, 270)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {Number} data.productId Product identifier
 * @apiSuccess {String} data.url Image URL
 * @apiSuccess {String|null} data.caption Image caption
 * @apiSuccess {Boolean} data.isPrimary Primary image flag
 * @apiSuccess {Number} data.displayOrder Display order
 * @apiSuccess {Number} data.width Image width
 * @apiSuccess {Number} data.height Image height
 * @apiSuccess {Number} data.rotation Rotation angle
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productImageUpdate(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {delete} /api/internal/product-image/:id Delete Product Image
 * @apiName DeleteProductImage
 * @apiGroup ProductImage
 *
 * @apiParam {Number} id Product image ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productImageDelete(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {patch} /api/internal/product-image/:id/reorder Reorder Product Images
 * @apiName ReorderProductImages
 * @apiGroup ProductImage
 *
 * @apiParam {Number} id Product image ID
 *
 * @apiBody {Number} newOrder New display order
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function reorderHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productImageReorder(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {patch} /api/internal/product-image/:id/set-primary Set Primary Image
 * @apiName SetPrimaryProductImage
 * @apiGroup ProductImage
 *
 * @apiParam {Number} id Product image ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function setPrimaryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await productImageSetPrimary(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
