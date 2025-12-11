/**
 * @service ProductImageService
 * @domain product-image
 * @type REST
 */

import { authenticatedClient } from '@/core/lib/api';
import type {
  ProductImage,
  ProductImageListParams,
  CreateProductImageDto,
  UpdateProductImageDto,
  ReorderProductImageDto,
} from '../types/models';

export const productImageService = {
  async list(params?: ProductImageListParams): Promise<ProductImage[]> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: ProductImage[] }>(
      '/product-image',
      { params }
    );
    return data.data;
  },

  async getById(id: number): Promise<ProductImage> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: ProductImage }>(
      `/product-image/${id}`
    );
    return data.data;
  },

  async create(dto: CreateProductImageDto): Promise<ProductImage> {
    const { data } = await authenticatedClient.post<{ success: boolean; data: ProductImage }>(
      '/product-image',
      dto
    );
    return data.data;
  },

  async update(id: number, dto: UpdateProductImageDto): Promise<ProductImage> {
    const { data } = await authenticatedClient.put<{ success: boolean; data: ProductImage }>(
      `/product-image/${id}`,
      dto
    );
    return data.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<{
      success: boolean;
      data: { message: string };
    }>(`/product-image/${id}`);
    return data.data;
  },

  async reorder(id: number, dto: ReorderProductImageDto): Promise<{ message: string }> {
    const { data } = await authenticatedClient.patch<{
      success: boolean;
      data: { message: string };
    }>(`/product-image/${id}/reorder`, dto);
    return data.data;
  },

  async setPrimary(id: number): Promise<{ message: string }> {
    const { data } = await authenticatedClient.patch<{
      success: boolean;
      data: { message: string };
    }>(`/product-image/${id}/set-primary`);
    return data.data;
  },
};
