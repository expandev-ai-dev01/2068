/**
 * @summary
 * Type definitions for ProductImage entity.
 *
 * @module services/productImage/productImageTypes
 */

/**
 * @interface ProductImageEntity
 * @description Represents a product image entity in the gallery
 */
export interface ProductImageEntity {
  id: number;
  productId: number;
  url: string;
  caption: string | null;
  isPrimary: boolean;
  displayOrder: number;
  width: number;
  height: number;
  rotation: number;
  dateCreated: string;
  dateModified: string;
}

/**
 * @interface ProductImageCreateRequest
 * @description Request payload for creating a product image
 */
export interface ProductImageCreateRequest {
  productId: number;
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
  displayOrder?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

/**
 * @interface ProductImageUpdateRequest
 * @description Request payload for updating a product image
 */
export interface ProductImageUpdateRequest {
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
  displayOrder?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

/**
 * @interface ProductImageListResponse
 * @description Response structure for listing product images
 */
export interface ProductImageListResponse {
  id: number;
  productId: number;
  url: string;
  caption: string | null;
  isPrimary: boolean;
  displayOrder: number;
  dateCreated: string;
}
