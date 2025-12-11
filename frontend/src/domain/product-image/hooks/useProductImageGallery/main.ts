import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productImageService } from '../../services/productImageService';
import type { UseProductImageGalleryOptions, UseProductImageGalleryReturn } from './types';

export const useProductImageGallery = ({
  productId,
}: UseProductImageGalleryOptions): UseProductImageGalleryReturn => {
  const queryClient = useQueryClient();
  const queryKey = ['product-images', productId];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    data: images = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => productImageService.list({ productId }),
  });

  const currentImage = images?.[currentIndex];

  const goToNext = useCallback(() => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1.0);
    setRotation(0);
  }, [images?.length]);

  const goToPrevious = useCallback(() => {
    if (!images?.length) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1.0);
    setRotation(0);
  }, [images?.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1.0);
    setRotation(0);
  }, []);

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.0));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1.0));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1.0);
  }, []);

  const rotateImage = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const { mutateAsync: setPrimaryMutation } = useMutation({
    mutationFn: (id: number) => productImageService.setPrimary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const { mutateAsync: reorderMutation } = useMutation({
    mutationFn: ({ id, newOrder }: { id: number; newOrder: number }) =>
      productImageService.reorder(id, { newOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const setPrimary = useCallback(
    async (id: number) => {
      await setPrimaryMutation(id);
    },
    [setPrimaryMutation]
  );

  const reorderImage = useCallback(
    async (id: number, newOrder: number) => {
      await reorderMutation({ id, newOrder });
    },
    [reorderMutation]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Home') goToImage(0);
      if (e.key === 'End' && images?.length) goToImage(images.length - 1);
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, goToImage, images?.length, isFullscreen, toggleFullscreen]);

  return {
    images,
    isLoading,
    error: error as Error | null,
    currentIndex,
    currentImage,
    zoomLevel,
    rotation,
    isFullscreen,
    goToNext,
    goToPrevious,
    goToImage,
    zoomIn,
    zoomOut,
    resetZoom,
    rotateImage,
    toggleFullscreen,
    setPrimary,
    reorderImage,
  };
};
