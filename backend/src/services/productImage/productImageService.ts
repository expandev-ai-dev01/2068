/**
 * @summary
 * Business logic for ProductImage entity.
 * Handles CRUD operations and image gallery management using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/productImage/productImageService
 */

import { PRODUCT_IMAGE_DEFAULTS } from '@/constants';
import { productImageStore } from '@/instances';
import { ServiceError } from '@/utils';
import { ProductImageEntity, ProductImageListResponse } from './productImageTypes';
import { createSchema, updateSchema, reorderSchema, paramsSchema } from './productImageValidation';

/**
 * @summary
 * Lists all product images, optionally filtered by product ID.
 *
 * @function productImageList
 * @module services/productImage
 *
 * @param {number} [productId] - Optional product ID to filter images
 * @returns {Promise<ProductImageListResponse[]>} List of product image entities
 *
 * @example
 * const images = await productImageList(1);
 * // Returns: [{ id: 1, productId: 1, url: 'https://...', isPrimary: true, ... }]
 */
export async function productImageList(productId?: number): Promise<ProductImageListResponse[]> {
  const records = productImageStore.getAll();
  const filtered = productId ? records.filter((r) => r.productId === productId) : records;

  return filtered.map((e) => ({
    id: e.id,
    productId: e.productId,
    url: e.url,
    caption: e.caption,
    isPrimary: e.isPrimary,
    displayOrder: e.displayOrder,
    dateCreated: e.dateCreated,
  }));
}

/**
 * @summary
 * Creates a new product image entity with validated data.
 *
 * @function productImageCreate
 * @module services/productImage
 *
 * @param {unknown} body - Raw request body to validate against createSchema
 * @returns {Promise<ProductImageEntity>} The newly created product image entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 * @throws {ServiceError} BUSINESS_RULE_ERROR (400) - When business rules are violated
 *
 * @example
 * const newImage = await productImageCreate({
 *   productId: 1,
 *   url: 'https://example.com/image.jpg',
 *   caption: 'Product view',
 *   isPrimary: true
 * });
 */
export async function productImageCreate(body: unknown): Promise<ProductImageEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;
  const now = new Date().toISOString();
  const id = productImageStore.getNextId();

  /**
   * @rule {be-business-rule-001}
   * If isPrimary is true, unset primary flag from other images of the same product
   */
  if (params.isPrimary) {
    const existingImages = productImageStore.getByProductId(params.productId);
    existingImages.forEach((img) => {
      if (img.isPrimary) {
        productImageStore.update(img.id, { isPrimary: false, dateModified: now });
      }
    });
  }

  /**
   * @rule {be-business-rule-002}
   * Auto-assign display order if not provided
   */
  let displayOrder: number = params.displayOrder ?? 0;
  if (displayOrder === 0) {
    const existingImages = productImageStore.getByProductId(params.productId);
    displayOrder =
      existingImages.length > 0 ? Math.max(...existingImages.map((i) => i.displayOrder)) + 1 : 1;
  }

  const newImage: ProductImageEntity = {
    id,
    productId: params.productId,
    url: params.url,
    caption: params.caption ?? null,
    isPrimary: params.isPrimary ?? false,
    displayOrder,
    width: params.width ?? PRODUCT_IMAGE_DEFAULTS.WIDTH,
    height: params.height ?? PRODUCT_IMAGE_DEFAULTS.HEIGHT,
    rotation: params.rotation ?? PRODUCT_IMAGE_DEFAULTS.ROTATION,
    dateCreated: now,
    dateModified: now,
  };

  productImageStore.add(newImage);
  return newImage;
}

/**
 * @summary
 * Retrieves a specific product image by its unique identifier.
 *
 * @function productImageGet
 * @module services/productImage
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<ProductImageEntity>} The found product image entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const image = await productImageGet({ id: '1' });
 * // Returns: { id: 1, productId: 1, url: 'https://...', ... }
 */
export async function productImageGet(params: unknown): Promise<ProductImageEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = productImageStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Product image not found', 404);
  }

  return record as ProductImageEntity;
}

/**
 * @summary
 * Updates an existing product image entity with new data.
 *
 * @function productImageUpdate
 * @module services/productImage
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with update data to validate
 * @returns {Promise<ProductImageEntity>} The updated product image entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const updated = await productImageUpdate({ id: '1' }, { caption: 'Updated caption', rotation: 90 });
 */
export async function productImageUpdate(
  params: unknown,
  body: unknown
): Promise<ProductImageEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = productImageStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Product image not found', 404);
  }

  const updateData = bodyValidation.data;
  const now = new Date().toISOString();

  /**
   * @rule {be-business-rule-001}
   * If isPrimary is being set to true, unset primary flag from other images
   */
  if (updateData.isPrimary && !existing.isPrimary) {
    const existingImages = productImageStore.getByProductId(existing.productId);
    existingImages.forEach((img) => {
      if (img.id !== id && img.isPrimary) {
        productImageStore.update(img.id, { isPrimary: false, dateModified: now });
      }
    });
  }

  const updated = productImageStore.update(id, {
    url: updateData.url,
    caption: updateData.caption ?? existing.caption,
    isPrimary: updateData.isPrimary ?? existing.isPrimary,
    displayOrder: updateData.displayOrder ?? existing.displayOrder,
    width: updateData.width ?? existing.width,
    height: updateData.height ?? existing.height,
    rotation: updateData.rotation ?? existing.rotation,
    dateModified: now,
  });

  return updated as ProductImageEntity;
}

/**
 * @summary
 * Permanently deletes a product image entity by its ID.
 *
 * @function productImageDelete
 * @module services/productImage
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const result = await productImageDelete({ id: '1' });
 * // Returns: { message: 'Product image deleted successfully' }
 */
export async function productImageDelete(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;

  if (!productImageStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Product image not found', 404);
  }

  productImageStore.delete(id);
  return { message: 'Product image deleted successfully' };
}

/**
 * @summary
 * Reorders a product image by changing its display order.
 *
 * @function productImageReorder
 * @module services/productImage
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with new order
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When validation fails
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const result = await productImageReorder({ id: '1' }, { newOrder: 3 });
 */
export async function productImageReorder(
  params: unknown,
  body: unknown
): Promise<{ message: string }> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = reorderSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const { newOrder } = bodyValidation.data;

  const existing = productImageStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Product image not found', 404);
  }

  productImageStore.update(id, {
    displayOrder: newOrder,
    dateModified: new Date().toISOString(),
  });

  return { message: 'Product image reordered successfully' };
}

/**
 * @summary
 * Sets a product image as the primary image for its product.
 *
 * @function productImageSetPrimary
 * @module services/productImage
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const result = await productImageSetPrimary({ id: '1' });
 */
export async function productImageSetPrimary(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const existing = productImageStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Product image not found', 404);
  }

  const now = new Date().toISOString();

  /**
   * @rule {be-business-rule-001}
   * Unset primary flag from all other images of the same product
   */
  const existingImages = productImageStore.getByProductId(existing.productId);
  existingImages.forEach((img) => {
    if (img.id !== id && img.isPrimary) {
      productImageStore.update(img.id, { isPrimary: false, dateModified: now });
    }
  });

  productImageStore.update(id, { isPrimary: true, dateModified: now });

  return { message: 'Primary image set successfully' };
}
