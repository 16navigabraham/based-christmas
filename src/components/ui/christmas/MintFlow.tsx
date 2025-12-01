"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { CheckCircle2, Loader2, ExternalLink, Download } from 'lucide-react';
import { 
  CHRISTMAS_CAP_ABI, 
  CHRISTMAS_CAP_CONTRACT_ADDRESS, 
  USDC_ADDRESS, 
  ERC20_ABI,
  CAP_PRICE,
  CAP_PRICE_FORMATTED
} from '~/lib/contracts';
import { uploadBothImages, ipfsToHttp } from '~/lib/ipfs';

interface MintFlowProps {
  originalImage: File;
  cappedBlob: Blob;
}

type FlowStep = 'upload' | 'approve' | 'mint' | 'success';

/**
 * Component that handles IPFS upload and smart contract interaction
 */
export function MintFlow({ originalImage, cappedBlob }: MintFlowProps) {
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [error, setError] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [cappedUrl, setCappedUrl] = useState<string>('');

  const { writeContract: approveUSDC, data: approveHash, isPending: isApproving } = useWriteContract();
  const { writeContract: mintCap, data: mintHash, isPending: isMinting } = useWriteContract();

  const { isLoading: isApproveTxLoading, isSuccess: isApproveTxSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isMintTxLoading, isSuccess: isMintTxSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  // Check USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Check USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CHRISTMAS_CAP_CONTRACT_ADDRESS] : undefined,
  });

  // Upload to IPFS on mount
  useEffect(() => {
    let cancelled = false;

    async function upload() {
      try {
        setError(null);
        const { originalUrl: origUrl, cappedUrl: capUrl } = await uploadBothImages(
          originalImage,
          cappedBlob
        );

        if (cancelled) return;

        setOriginalUrl(origUrl);
        setCappedUrl(capUrl);
        setCurrentStep('approve');
      } catch (err) {
        if (cancelled) return;
        console.error('Upload error:', err);
        setError('Failed to upload images to IPFS. Please try again.');
      }
    }

    upload();

    return () => {
      cancelled = true;
    };
  }, [originalImage, cappedBlob]);

  // Handle approve transaction success
  useEffect(() => {
    if (isApproveTxSuccess) {
      refetchAllowance();
      setCurrentStep('mint');
    }
  }, [isApproveTxSuccess, refetchAllowance]);

  // Handle mint transaction success
  useEffect(() => {
    if (isMintTxSuccess) {
      setCurrentStep('success');
    }
  }, [isMintTxSuccess]);

  // Handle approval
  const handleApprove = async () => {
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    // Check if already approved
    if (allowance && allowance >= CAP_PRICE) {
      setCurrentStep('mint');
      return;
    }

    // Check balance
    if (!usdcBalance || usdcBalance < CAP_PRICE) {
      setError(`Insufficient USDC balance. You need ${CAP_PRICE_FORMATTED}`);
      return;
    }

    try {
      setError(null);
      approveUSDC({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CHRISTMAS_CAP_CONTRACT_ADDRESS, CAP_PRICE],
      });
    } catch (err: any) {
      console.error('Approve error:', err);
      setError(err.message || 'Failed to approve USDC');
    }
  };

  // Handle minting
  const handleMint = async () => {
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    if (!cappedUrl) {
      setError('Image not uploaded yet');
      return;
    }

    try {
      setError(null);
      mintCap({
        address: CHRISTMAS_CAP_CONTRACT_ADDRESS,
        abi: CHRISTMAS_CAP_ABI,
        functionName: 'mintChristmasCap',
        args: [cappedUrl],
      });
    } catch (err: any) {
      console.error('Mint error:', err);
      setError(err.message || 'Failed to mint Christmas PFP');
    }
  };

  const handleDownload = () => {
    const imageUrl = ipfsToHttp(cappedUrl);
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
  };

  const isProcessing = isApproving || isApproveTxLoading || isMinting || isMintTxLoading;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        <StepIndicator step={1} label="Upload" active={currentStep === 'upload'} completed={currentStep !== 'upload'} />
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
        <StepIndicator step={2} label="Approve" active={currentStep === 'approve'} completed={currentStep === 'mint' || currentStep === 'success'} />
        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 mx-2" />
        <StepIndicator step={3} label="Mint" active={currentStep === 'mint'} completed={currentStep === 'success'} />
      </div>

      {/* Content based on step */}
      <div className="card p-6">
        {currentStep === 'upload' && (
          <div className="text-center space-y-4">
            <div className="spinner h-12 w-12 mx-auto"></div>
            <p className="font-medium">Uploading to IPFS...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Storing your images on the decentralized web
            </p>
          </div>
        )}

        {currentStep === 'approve' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Approve USDC</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Allow the contract to spend {CAP_PRICE_FORMATTED}
              </p>
            </div>
            
            {usdcBalance && (
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Your balance: {(Number(usdcBalance) / 1e6).toFixed(2)} USDC
              </p>
            )}

            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {isApproving || isApproveTxLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                `Approve ${CAP_PRICE_FORMATTED}`
              )}
            </button>
          </div>
        )}

        {currentStep === 'mint' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">Mint Your Christmas PFP</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Store your festive PFP on-chain for {CAP_PRICE_FORMATTED}
              </p>
            </div>

            <button
              onClick={handleMint}
              disabled={isProcessing}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {isMinting || isMintTxLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Minting...
                </>
              ) : (
                `Mint for ${CAP_PRICE_FORMATTED}`
              )}
            </button>
          </div>
        )}

        {currentStep === 'success' && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Success! 🎉</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your Christmas PFP is now on-chain!
              </p>
            </div>

            <img
              src={ipfsToHttp(cappedUrl)}
              alt="Your Christmas PFP"
              className="mx-auto max-w-xs rounded-lg shadow-lg border-2 border-blue-500"
            />

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  const imageUrl = ipfsToHttp(cappedUrl);
                  if (window.sdk?.actions.composeCast) {
                    window.sdk.actions.composeCast({
                      text: 'Just minted my Based Christmas PFP! 🎄⛓️ Staying Based on @base',
                      embeds: [imageUrl]
                    });
                  }
                }}
                className="btn btn-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Cast to Farcaster
              </button>

              {mintHash && (
                <a
                  href={`https://basescan.org/tx/${mintHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  View on BaseScan
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for step indicators
function StepIndicator({ 
  step, 
  label, 
  active, 
  completed 
}: { 
  step: number; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors
          ${completed ? 'bg-green-500 text-white' : active ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}
        `}
      >
        {completed ? <CheckCircle2 className="w-5 h-5" /> : step}
      </div>
      <p className="text-xs mt-1 font-medium">{label}</p>
    </div>
  );
}
