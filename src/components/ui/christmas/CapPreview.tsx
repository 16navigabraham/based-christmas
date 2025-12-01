"use client";

import { useEffect, useState } from 'react';
import { addChristmasCapToImage, fileToDataUrl } from '~/lib/imageProcessing';
import { Sparkles } from 'lucide-react';

interface CapPreviewProps {
  originalImage: File;
  onProcessed: (cappedBlob: Blob) => void;
}

/**
 * Component that processes and displays the PFP with Christmas cap using AI positioning
 */
export function CapPreview({ originalImage, onProcessed }: CapPreviewProps) {
  const [processing, setProcessing] = useState(false);
  const [cappedPreview, setCappedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function processImage() {
      setProcessing(true);
      setError(null);

      try {
        // Add Christmas cap with AI-powered smart positioning
        const cappedBlob = await addChristmasCapToImage(originalImage);
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
  }, [originalImage, onProcessed]);

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="spinner h-16 w-16"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
        </div>
        <p className="text-lg font-medium">Adding Christmas magic...</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          AI is finding the perfect cap position ✨
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
          AI automatically positioned the cap perfectly ✨
        </p>
      </div>

      {/* Large Preview */}
      {cappedPreview && (
        <div className="max-w-md mx-auto">
          <img
            src={cappedPreview}
            alt="With Christmas Cap"
            className="w-full rounded-lg shadow-xl border-2 border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
          />
        </div>
      )}
    </div>
  );
}
