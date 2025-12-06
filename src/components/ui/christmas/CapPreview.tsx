"use client";

import { useEffect, useState, useRef } from 'react';
import { addChristmasCapToImageWithPosition, fileToDataUrl } from '~/lib/imageProcessing';

interface CapPreviewProps {
  originalImage: File;
  onProcessed: (cappedBlob: Blob) => void;
}

/**
 * Component that displays PFP with interactive Christmas cap positioning
 */
export function CapPreview({ originalImage, onProcessed }: CapPreviewProps) {
  const [processing, setProcessing] = useState(false);
  const [cappedPreview, setCappedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  
  // Cap positioning controls
  const [capX, setCapX] = useState(50); // 0-100 (horizontal position)
  const [capY, setCapY] = useState(15); // 0-100 (vertical position)
  const [capSize, setCapSize] = useState(70); // 30-200 (size percentage)
  const [capRotation, setCapRotation] = useState(0); // -45 to 45 degrees

  const processingRef = useRef(false);

  // Load original image preview
  useEffect(() => {
    fileToDataUrl(originalImage).then(setOriginalPreview);
  }, [originalImage]);

  // Process image with current settings
  useEffect(() => {
    if (processingRef.current) return;

    let cancelled = false;

    async function processImage() {
      processingRef.current = true;
      setProcessing(true);
      setError(null);

      try {
        // Convert percentage values to the format expected by the function
        const xOffset = (capX - 50) / 100; // -0.5 to 0.5
        const yOffset = (capY - 50) / 100; // -0.5 to 0.5
        const scale = capSize / 100; // 0.3 to 2.0

        const cappedBlob = await addChristmasCapToImageWithPosition(
          originalImage,
          scale,
          xOffset,
          yOffset
        );
        
        if (cancelled) return;

        const cappedUrl = await fileToDataUrl(cappedBlob);
        if (cancelled) return;
        
        setCappedPreview(cappedUrl);
        onProcessed(cappedBlob);
      } catch (err) {
        if (cancelled) return;
        console.error('Error processing image:', err);
        setError('Failed to process image. Please try again.');
      } finally {
        if (!cancelled) {
          setProcessing(false);
          processingRef.current = false;
        }
      }
    }

    const debounce = setTimeout(processImage, 100);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [originalImage, capX, capY, capSize, capRotation]);

  const handleReset = () => {
    setCapX(50);
    setCapY(15);
    setCapSize(70);
    setCapRotation(0);
  };

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
        <h3 className="text-xl font-bold mb-2">Position Your Christmas Cap 🎄</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the controls below to find the perfect placement
        </p>
      </div>

      {/* Preview */}
      <div className="max-w-md mx-auto relative">
        {cappedPreview ? (
          <img
            src={cappedPreview}
            alt="With Christmas Cap"
            className="w-full rounded-lg shadow-xl border-2 border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
          />
        ) : originalPreview ? (
          <img
            src={originalPreview}
            alt="Original"
            className="w-full rounded-lg shadow-xl opacity-50"
          />
        ) : null}
        {processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
            <div className="spinner h-8 w-8"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        {/* Horizontal Position */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Horizontal Position</label>
            <span className="text-xs text-gray-400">{capX}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={capX}
            onChange={(e) => setCapX(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Vertical Position */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Vertical Position</label>
            <span className="text-xs text-gray-400">{capY}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={capY}
            onChange={(e) => setCapY(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Cap Size</label>
            <span className="text-xs text-gray-400">{capSize}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="200"
            value={capSize}
            onChange={(e) => setCapSize(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors text-sm"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
