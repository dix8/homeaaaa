import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

interface Touch {
  x: number;
  y: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const ZOOM_SPEED = 0.1;

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageUrl, title, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouches = useRef<Touch[]>([]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // 鼠标滚轮缩放
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    setScale(currentScale => {
      const delta = -Math.sign(e.deltaY) * ZOOM_SPEED;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale + delta));
      return newScale;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touches = e.touches;

    if (touches.length === 2) {
      // 双指触摸：准备缩放
      const touch1 = { x: touches[0].clientX, y: touches[0].clientY };
      const touch2 = { x: touches[1].clientX, y: touches[1].clientY };
      lastTouches.current = [touch1, touch2];
      lastTouchDistance.current = getTouchDistance(touch1, touch2);
    } else if (touches.length === 1) {
      // 单指触摸：准备移动
      setIsDragging(true);
      setDragStart({
        x: touches[0].clientX - position.x,
        y: touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const touches = e.touches;

    if (touches.length === 2) {
      // 双指缩放
      const touch1 = { x: touches[0].clientX, y: touches[0].clientY };
      const touch2 = { x: touches[1].clientX, y: touches[1].clientY };
      const currentDistance = getTouchDistance(touch1, touch2);

      if (lastTouchDistance.current !== null && lastTouches.current.length === 2) {
        // 计算缩放比例变化
        const distanceChange = currentDistance - lastTouchDistance.current;
        const scaleDelta = (distanceChange / lastTouchDistance.current) * scale;

        // 计算缩放中心点
        const lastCenter = {
          x: (lastTouches.current[0].x + lastTouches.current[1].x) / 2,
          y: (lastTouches.current[0].y + lastTouches.current[1].y) / 2
        };
        const currentCenter = {
          x: (touch1.x + touch2.x) / 2,
          y: (touch1.y + touch2.y) / 2
        };

        // 更新缩放和位置
        setScale(currentScale => {
          const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale + scaleDelta));
          return newScale;
        });

        setPosition(currentPosition => ({
          x: currentPosition.x + (currentCenter.x - lastCenter.x),
          y: currentPosition.y + (currentCenter.y - lastCenter.y)
        }));
      }

      lastTouchDistance.current = currentDistance;
      lastTouches.current = [touch1, touch2];
    } else if (touches.length === 1 && isDragging) {
      // 单指移动
      setPosition({
        x: touches[0].clientX - dragStart.x,
        y: touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    lastTouchDistance.current = null;
    lastTouches.current = [];
  };

  // 计算两个触摸点之间的距离
  const getTouchDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.x - touch2.x;
    const dy = touch1.y - touch2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // 鼠标事件处理
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setScale(currentScale => currentScale === 1 ? 2 : 1);
    if (scale === 2) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full bg-white rounded-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{Math.round(scale * 100)}%</span>
              <button
                onClick={handleReset}
                className="text-blue-600 hover:text-blue-800"
                disabled={scale === 1 && position.x === 0 && position.y === 0}
              >
                重置
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div 
          ref={containerRef}
          className="relative overflow-hidden bg-gray-900"
          style={{ height: 'calc(100vh - 200px)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div
            className="absolute left-1/2 top-1/2 cursor-move select-none"
            style={{
              transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.2s'
            }}
          >
            <img
              src={imageUrl}
              alt={title}
              className="max-w-none"
              onDoubleClick={handleDoubleClick}
              onLoad={handleImageLoad}
              draggable={false}
              style={{
                maxHeight: '70vh',
                objectFit: 'contain',
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.2s'
              }}
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm py-2 px-4 rounded-full">
            双指缩放 • 拖动移动 • 双击放大/缩小
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview; 