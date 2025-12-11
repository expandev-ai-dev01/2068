/**
 * @summary
 * Validation schemas for ProductImage entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/productImage/productImageValidation
 */

import { z } from 'zod';
import { PRODUCT_IMAGE_LIMITS, PRODUCT_IMAGE_ROTATION_ANGLES } from '@/constants';

/**
 * Schema for create request validation
 */
export const createSchema = z.object({
  productId: z.number().int().positive(),
  url: z.string().min(1).max(PRODUCT_IMAGE_LIMITS.URL_MAX_LENGTH).url(),
  caption: z.string().max(PRODUCT_IMAGE_LIMITS.CAPTION_MAX_LENGTH).nullable().optional(),
  isPrimary: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  rotation: z
    .enum([
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_0),
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_90),
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_180),
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_270),
    ])
    .transform((val) => parseInt(val))
    .optional(),
});

/**
 * Schema for update request validation
 */
export const updateSchema = z.object({
  url: z.string().min(1).max(PRODUCT_IMAGE_LIMITS.URL_MAX_LENGTH).url(),
  caption: z.string().max(PRODUCT_IMAGE_LIMITS.CAPTION_MAX_LENGTH).nullable().optional(),
  isPrimary: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  rotation: z
    .enum([
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_0),
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_90),
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_180),
      String(PRODUCT_IMAGE_ROTATION_ANGLES.ANGLE_270),
    ])
    .transform((val) => parseInt(val))
    .optional(),
});

/**
 * Schema for reorder request validation
 */
export const reorderSchema = z.object({
  newOrder: z.number().int().min(0),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;
