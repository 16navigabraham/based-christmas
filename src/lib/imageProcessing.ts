/**
 * Image processing utilities for adding Christmas cap to PFP
 */

/**
 * Detects the best position for the Christmas cap using image analysis
 * @param ctx - Canvas context
 * @param imageData - Image data to analyze
 * @param size - Image size
 * @returns Object with scale, x, and y position
 */
function detectCapPosition(ctx: CanvasRenderingContext2D, imageData: ImageData, size: number) {
  const data = imageData.data;
  let topMostPixel = size;
  let leftSum = 0;
  let rightSum = 0;
  let count = 0;

  // Scan top portion of image to find the head
  for (let y = 0; y < size * 0.4; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;

      // Detect skin tones or bright areas (likely face/head)
      const isSkinTone = (r > 95 && g > 40 && b > 20 && r > g && r > b) || brightness > 100;
      
      if (isSkinTone) {
        if (y < topMostPixel) topMostPixel = y;
        leftSum += x;
        rightSum += x;
        count++;
      }
    }
  }

  // Calculate center position
  const centerX = count > 0 ? leftSum / count : size / 2;
  const capY = topMostPixel > 0 ? topMostPixel - (size * 0.15) : -(size * 0.35);
  const capX = centerX - (size / 2);

  // Adjust scale based on detected head size
  const headWidth = count > 0 ? Math.sqrt(count) : size * 0.5;
  const scale = Math.min(0.85, Math.max(0.6, (headWidth / size) * 1.2));

  return {
    scale,
    x: capX / size,
    y: capY / size
  };
}

/**
 * Adds a blue Christmas cap overlay to an uploaded image with smart AI positioning
 * @param imageFile - The uploaded image file
 * @returns Promise resolving to a Blob of the processed image
 */
export async function addChristmasCapToImage(
  imageFile: File
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new window.Image();
    
    img.onload = async () => {
      // Set canvas size to match image
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      // Draw the original image (cropped to square if needed)
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

      // Analyze image to detect best cap position
      const imageData = ctx.getImageData(0, 0, size, size);
      const position = detectCapPosition(ctx, imageData, size);

      // Load and draw the Christmas cap
      const cap = new window.Image();
      cap.onload = () => {
        // Calculate cap size and position using AI detection
        const capWidth = size * position.scale;
        const capHeight = capWidth * 0.8;
        const capX = (size - capWidth) / 2 + (position.x * size);
        const capY = position.y * size;

        ctx.drawImage(cap, capX, capY, capWidth, capHeight);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        }, 'image/png');
      };

      cap.onerror = () => {
        reject(new Error('Failed to load Christmas cap'));
      };

      cap.src = '/christmas-cap.png';
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Adds a blue Christmas cap overlay to an uploaded image with custom position
 * @param imageFile - The uploaded image file
 * @param capScale - Scale of the cap (0.5 to 1.5, default 0.7)
 * @param capX - X position offset (-0.5 to 0.5, default 0)
 * @param capY - Y position offset (-0.5 to 0.5, default -0.4)
 * @returns Promise resolving to a Blob of the processed image
 */
export async function addChristmasCapToImageWithPosition(
  imageFile: File,
  capScale: number = 0.7,
  capX: number = 0,
  capY: number = -0.4
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new window.Image();
    
    img.onload = async () => {
      // Set canvas size to match image
      const size = Math.min(img.width, img.height);
      canvas.width = size;
      canvas.height = size;

      // Draw the original image (cropped to square if needed)
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

      // Load and draw the Christmas cap
      const cap = new window.Image();
      cap.onload = () => {
        // Calculate cap size and position
        const capWidth = size * capScale;
        const capHeight = capWidth * 0.8;
        const posX = (size - capWidth) / 2 + (capX * size);
        const posY = (capY * size);

        ctx.drawImage(cap, posX, posY, capWidth, capHeight);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create image blob'));
          }
        }, 'image/png');
      };

      cap.onerror = () => {
        reject(new Error('Failed to load Christmas cap'));
      };

      cap.src = '/christmas-cap.png';
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Converts a File or Blob to a data URL
 * @param file - The file to convert
 * @returns Promise resolving to a data URL string
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validates that a file is an image
 * @param file - The file to validate
 * @returns true if the file is an image
 */
export function isValidImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validates image file size (max 5MB)
 * @param file - The file to validate
 * @returns true if the file size is acceptable
 */
export function isValidFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}
