import { useState, useRef, useEffect } from 'react';
import { cn } from '@/core/lib/utils';
import { Button } from '@/core/components/button';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { useProductImageGallery } from '../../hooks/useProductImageGallery';
import type { ProductImageGalleryProps } from './types';

function ProductImageGallery({ productId, className }: ProductImageGalleryProps) {
  const {
    images,
    isLoading,
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
    rotateImage,
    toggleFullscreen,
  } = useProductImageGallery({ productId });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (zoomLevel === 1.0) {
      setImagePosition({ x: 0, y: 0 });
    }
  }, [zoomLevel, currentIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1.0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1.0) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = () => {
    if (zoomLevel === 1.0) {
      zoomIn();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!images?.length) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const galleryContent = (
    <div
      className={cn(
        'relative flex flex-col gap-4',
        isFullscreen && 'fixed inset-0 z-50 bg-black p-4',
        className
      )}
    >
      {/* Main Image Area */}
      <div className="bg-muted relative flex-1 overflow-hidden rounded-lg border">
        <div
          ref={imageRef}
          className={cn(
            'relative flex h-full w-full items-center justify-center',
            zoomLevel > 1.0 && 'cursor-move',
            zoomLevel === 1.0 && 'cursor-zoom-in'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleImageClick}
        >
          {currentImage && (
            <img
              src={currentImage.url}
              alt={currentImage.caption || `Imagem ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${
                  imagePosition.x / zoomLevel
                }px, ${imagePosition.y / zoomLevel}px)`,
              }}
              draggable={false}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background absolute left-4 top-1/2 -translate-y-1/2 shadow-lg"
              onClick={goToPrevious}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background absolute right-4 top-1/2 -translate-y-1/2 shadow-lg"
              onClick={goToNext}
            >
              <ChevronRight />
            </Button>
          </>
        )}

        {/* Control Buttons */}
        <div className="absolute right-4 top-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background shadow-lg"
            onClick={zoomIn}
            disabled={zoomLevel >= 3.0}
          >
            <ZoomIn />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background shadow-lg"
            onClick={zoomOut}
            disabled={zoomLevel <= 1.0}
          >
            <ZoomOut />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background shadow-lg"
            onClick={rotateImage}
          >
            <RotateCw />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background shadow-lg"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
          {isFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background shadow-lg"
              onClick={toggleFullscreen}
            >
              <X />
            </Button>
          )}
        </div>

        {/* Image Counter */}
        <div className="bg-background/80 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md px-3 py-1 text-sm shadow-lg">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Caption */}
        {currentImage?.caption && (
          <div className="bg-background/80 absolute bottom-4 left-4 right-4 rounded-md p-2 text-center text-sm shadow-lg">
            {currentImage.caption}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {!isFullscreen && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={cn(
                'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all hover:opacity-100',
                currentIndex === index
                  ? 'border-primary opacity-100'
                  : 'border-transparent opacity-60'
              )}
            >
              <img
                src={image.url}
                alt={image.caption || `Miniatura ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return galleryContent;
}

export { ProductImageGallery };
