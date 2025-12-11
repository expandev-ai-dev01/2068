/**
 * @summary
 * Default values and constants for ProductImage entity.
 * Provides centralized configuration for image gallery management.
 *
 * @module constants/productImage/productImageDefaults
 */

/**
 * @interface ProductImageDefaultsType
 * @description Default configuration values for product images.
 *
 * @property {number} WIDTH - Default image width in pixels (1200)
 * @property {number} HEIGHT - Default image height in pixels (800)
 * @property {number} ROTATION - Default rotation angle in degrees (0)
 * @property {number} MAX_ZOOM - Maximum zoom level (3.0)
 * @property {number} MIN_ZOOM - Minimum zoom level (1.0)
 * @property {number} ZOOM_STEP - Zoom increment step (0.5)
 */
export const PRODUCT_IMAGE_DEFAULTS = {
  /** Default image width in pixels */
  WIDTH: 1200,
  /** Default image height in pixels */
  HEIGHT: 800,
  /** Default rotation angle */
  ROTATION: 0,
  /** Maximum zoom level */
  MAX_ZOOM: 3.0,
  /** Minimum zoom level */
  MIN_ZOOM: 1.0,
  /** Zoom increment step */
  ZOOM_STEP: 0.5,
} as const;

/** Type representing the PRODUCT_IMAGE_DEFAULTS constant */
export type ProductImageDefaultsType = typeof PRODUCT_IMAGE_DEFAULTS;

/**
 * @interface ProductImageRotationAnglesType
 * @description Available rotation angles for product images.
 *
 * @property {number} ANGLE_0 - 0 degrees rotation
 * @property {number} ANGLE_90 - 90 degrees rotation
 * @property {number} ANGLE_180 - 180 degrees rotation
 * @property {number} ANGLE_270 - 270 degrees rotation
 */
export const PRODUCT_IMAGE_ROTATION_ANGLES = {
  ANGLE_0: 0,
  ANGLE_90: 90,
  ANGLE_180: 180,
  ANGLE_270: 270,
} as const;

/** Type representing the PRODUCT_IMAGE_ROTATION_ANGLES constant */
export type ProductImageRotationAnglesType = typeof PRODUCT_IMAGE_ROTATION_ANGLES;

/** Union type of all valid rotation angle values */
export type ProductImageRotationAngle =
  (typeof PRODUCT_IMAGE_ROTATION_ANGLES)[keyof typeof PRODUCT_IMAGE_ROTATION_ANGLES];

/**
 * @interface ProductImageLimitsType
 * @description Validation constraints for ProductImage entity fields.
 *
 * @property {number} URL_MAX_LENGTH - Maximum characters for URL field (500)
 * @property {number} CAPTION_MAX_LENGTH - Maximum characters for caption field (150)
 * @property {number} MIN_WIDTH - Minimum image width in pixels (100)
 * @property {number} MIN_HEIGHT - Minimum image height in pixels (100)
 * @property {number} MAX_WIDTH - Maximum image width in pixels (5000)
 * @property {number} MAX_HEIGHT - Maximum image height in pixels (5000)
 */
export const PRODUCT_IMAGE_LIMITS = {
  URL_MAX_LENGTH: 500,
  CAPTION_MAX_LENGTH: 150,
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 5000,
  MAX_HEIGHT: 5000,
} as const;

/** Type representing the PRODUCT_IMAGE_LIMITS constant */
export type ProductImageLimitsType = typeof PRODUCT_IMAGE_LIMITS;
