/**
 * Image processing utilities for adding Christmas cap to PFP
 */

/**
 * Adds a blue Christmas cap overlay to an uploaded image
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

    const img = new Image();
    
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
      const cap = new Image();
      cap.onload = () => {
        // Calculate cap size and position (top center)
        const capWidth = size * 0.7; // Cap is 70% of image width
        const capHeight = capWidth * 0.8; // Maintain aspect ratio
        const capX = (size - capWidth) / 2;
        const capY = -capHeight * 0.4; // Position at top with better overlap

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

    const img = new Image();
    
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
      const cap = new Image();
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
