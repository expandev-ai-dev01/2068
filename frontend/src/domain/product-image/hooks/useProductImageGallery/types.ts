import type { ProductImage } from '../../types/models';

export interface UseProductImageGalleryOptions {
  productId: number;
}

export interface UseProductImageGalleryReturn {
  images: ProductImage[];
  isLoading: boolean;
  error: Error | null;
  currentIndex: number;
  currentImage: ProductImage | undefined;
  zoomLevel: number;
  rotation: number;
  isFullscreen: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToImage: (index: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  rotateImage: () => void;
  toggleFullscreen: () => void;
  setPrimary: (id: number) => Promise<void>;
  reorderImage: (id: number, newOrder: number) => Promise<void>;
}
