"use client";

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ImageUpload } from '../christmas/ImageUpload';
import { CapPreview } from '../christmas/CapPreview';
import { MintFlow } from '../christmas/MintFlow';
import { UserDashboard } from '../../christmas/UserDashboard';
import { ArrowRight } from 'lucide-react';

type FlowStep = 'upload' | 'preview' | 'mint' | 'dashboard';

/**
 * HomeTab component displays the Christmas Cap PFP mini app.
 * 
 * Users can upload their profile picture, add a blue Christmas cap overlay,
 * and mint it on-chain for 0.1 USDC.
 */
export function HomeTab() {
  const { address, isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<FlowStep>('upload');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [cappedBlob, setCappedBlob] = useState<Blob | null>(null);

  const handleImageSelect = (file: File) => {
    setOriginalImage(file);
    setCurrentStep('preview');
  };

  const handleProcessed = (blob: Blob) => {
    setCappedBlob(blob);
  };

  const handleProceedToMint = () => {
    setCurrentStep('mint');
  };

  const handleStartOver = () => {
    setOriginalImage(null);
    setCappedBlob(null);
    setCurrentStep('upload');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Add a Blue Christmas Cap to Your PFP 🎄
        </h1>
        <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
          Upload your profile picture, get a festive blue Christmas cap overlay, and mint it on-chain for just 0.1 USDC!
        </p>
      </div>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md">
            <p className="text-xl mb-6">Connect your wallet to get started with your festive PFP transformation!</p>
            <p className="text-sm text-gray-400">You&apos;ll need a wallet with USDC on Base network</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Main Flow */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            {currentStep === 'upload' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Step 1: Upload Your PFP</h2>
                <ImageUpload onImageSelect={handleImageSelect} />
              </div>
            )}

            {currentStep === 'preview' && originalImage && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Step 2: Preview Your Festive PFP</h2>
                <CapPreview 
                  originalImage={originalImage} 
                  onProcessed={handleProcessed}
                />
                {cappedBlob && (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleStartOver}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                    >
                      Start Over
                    </button>
                    <button
                      onClick={handleProceedToMint}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      Proceed to Mint
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'mint' && originalImage && cappedBlob && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Step 3: Mint Your Christmas PFP</h2>
                <MintFlow 
                  originalImage={originalImage}
                  cappedBlob={cappedBlob}
                />
                <div className="text-center">
                  <button
                    onClick={handleStartOver}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Create another one
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Dashboard */}
          {address && <UserDashboard address={address} />}
        </div>
      )}
    </div>
  );
} 