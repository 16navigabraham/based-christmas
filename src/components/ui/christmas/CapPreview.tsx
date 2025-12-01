"use client";

import { useEffect, useState, useRef } from 'react';
import { addChristmasCapToImage, addChristmasCapToImageWithPosition, fileToDataUrl } from '~/lib/imageProcessing';
import { Sparkles, Move } from 'lucide-react';

interface CapPreviewProps {
  originalImage: File;
  onProcessed: (cappedBlob: Blob) => void;
}

/**
 * Component that processes and displays the PFP with Christmas cap
 */
export function CapPreview({ originalImage, onProcessed }: CapPreviewProps) {
  const [processing, setProcessing] = useState(false);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [cappedPreview, setCappedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capPosition, setCapPosition] = useState({ x: 0, y: -0.4 });
  const [capScale, setCapScale] = useState(0.7);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Initial processing
  useEffect(() => {
    let cancelled = false;

    async function processImage() {
      setProcessing(true);
      setError(null);

      try {
        // Create original preview
        const originalUrl = await fileToDataUrl(originalImage);
        if (cancelled) return;
        setOriginalPreview(originalUrl);

        // Add Christmas cap with default position
        const cappedBlob = await addChristmasCapToImageWithPosition(
          originalImage,
          capScale,
          capPosition.x,
          capPosition.y
        );
        if (cancelled) return;

        // Create capped preview
        const cappedUrl = await fileToDataUrl(cappedBlob);
        if (cancelled) return;
        setCappedPreview(cappedUrl);

        // Notify parent
        onProcessed(cappedBlob);
      } catch (err) {
        if (cancelled) return;
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try again.');
      } finally {
        if (!cancelled) {
          setProcessing(false);
        }
      }
    }

    processImage();

    return () => {
      cancelled = true;
    };
  }, [originalImage]);

  // Reprocess when position or scale changes
  useEffect(() => {
    if (!originalPreview || processing) return;

    let cancelled = false;

    async function reprocessImage() {
      try {
        const cappedBlob = await addChristmasCapToImageWithPosition(
          originalImage,
          capScale,
          capPosition.x,
          capPosition.y
        );
        if (cancelled) return;

        const cappedUrl = await fileToDataUrl(cappedBlob);
        if (cancelled) return;
        setCappedPreview(cappedUrl);

        onProcessed(cappedBlob);
      } catch (err) {
        if (cancelled) return;
        console.error('Error reprocessing image:', err);
      }
    }

    reprocessImage();

    return () => {
      cancelled = true;
    };
  }, [capPosition, capScale]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragStartRef.current.x) / rect.width;
    const dy = (e.clientY - dragStartRef.current.y) / rect.height;

    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setCapPosition(prev => ({
      x: Math.max(-0.5, Math.min(0.5, prev.x + dx)),
      y: Math.max(-0.5, Math.min(0.5, prev.y + dy))
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !canvasRef.current) return;

    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const dx = (touch.clientX - dragStartRef.current.x) / rect.width;
    const dy = (touch.clientY - dragStartRef.current.y) / rect.height;

    dragStartRef.current = { x: touch.clientX, y: touch.clientY };

    setCapPosition(prev => ({
      x: Math.max(-0.5, Math.min(0.5, prev.x + dx)),
      y: Math.max(-0.5, Math.min(0.5, prev.y + dy))
    }));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="spinner h-16 w-16"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-lg font-medium">Adding Christmas magic...</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Placing your festive cap ✨
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2">Your Festive PFP! 🎄</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag the preview to adjust the cap position
        </p>
      </div>

      {/* Controls */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-3">
          <Move className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="flex-1">
            <label className="text-sm font-medium block mb-1">Cap Size</label>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={capScale}
              onChange={(e) => setCapScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <span className="text-sm font-mono">{Math.round(capScale * 100)}%</span>
        </div>
        <button
          onClick={() => {
            setCapPosition({ x: 0, y: -0.4 });
            setCapScale(0.7);
          }}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Reset Position
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-center">Before</p>
          {originalPreview && (
            <img
              src={originalPreview}
              alt="Original"
              className="w-full rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700"
            />
          )}
        </div>

        {/* Capped - Draggable */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-center text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
            After ✨ <Move className="w-4 h-4" />
          </p>
          {cappedPreview && (
            <div
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              <img
                src={cappedPreview}
                alt="With Christmas Cap"
                className="w-full rounded-lg shadow-lg border-2 border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700 select-none"
                draggable={false}
              />
              {!isDragging && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                    Drag to adjust
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
