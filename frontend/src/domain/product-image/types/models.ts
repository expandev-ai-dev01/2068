export interface ProductImage {
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

export interface ProductImageListParams {
  productId?: number;
}

export interface CreateProductImageDto {
  productId: number;
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
  displayOrder?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface UpdateProductImageDto {
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
  displayOrder?: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface ReorderProductImageDto {
  newOrder: number;
}
