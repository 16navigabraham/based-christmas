/**
 * IPFS upload utilities using Pinata
 */

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || '';
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

/**
 * Uploads an image to IPFS via Pinata
 * @param blob - The image blob to upload
 * @param filename - Optional filename for the upload
 * @returns Promise resolving to the IPFS URL
 */
export async function uploadToIPFS(
  blob: Blob,
  filename: string = 'image.png'
): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', blob, filename);

    const metadata = JSON.stringify({
      name: filename,
      keyvalues: {
        app: 'based-christmas',
        type: 'pfp',
        timestamp: Date.now().toString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append('pinataOptions', options);

    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Pinata error:', errorData);
      throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

/**
 * Converts an IPFS URL to an HTTP gateway URL
 * @param ipfsUrl - The IPFS URL (ipfs://...)
 * @returns HTTP gateway URL
 */
export function ipfsToHttp(ipfsUrl: string): string {
  if (!ipfsUrl) return '';
  if (ipfsUrl.startsWith('http')) return ipfsUrl;
  
  const cid = ipfsUrl.replace('ipfs://', '');
  
  // Cloudflare IPFS is fastest and most reliable for Farcaster
  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
}

/**
 * Uploads both original and capped images to IPFS
 * @param originalFile - The original image file
 * @param cappedBlob - The processed image with Christmas cap
 * @returns Promise resolving to both IPFS URLs
 */
export async function uploadBothImages(
  originalFile: File,
  cappedBlob: Blob
): Promise<{ originalUrl: string; cappedUrl: string }> {
  const [originalUrl, cappedUrl] = await Promise.all([
    uploadToIPFS(originalFile, `original-${originalFile.name}`),
    uploadToIPFS(cappedBlob, `capped-${originalFile.name}`),
  ]);

  return { originalUrl, cappedUrl };
}
