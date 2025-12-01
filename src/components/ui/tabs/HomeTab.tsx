"use client";

import { useAccount } from 'wagmi';
import { MintFlow } from '../christmas/MintFlow';
import { UserDashboard } from '../christmas/UserDashboard';

/**
 * HomeTab component displays the Christmas Cap PFP mini app.
 * 
 * Users can upload their profile picture, add a blue Christmas cap overlay,
 * and mint it on-chain for 0.1 USDC.
 */
export function HomeTab() {
  const { address, isConnected } = useAccount();

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
            <p className="text-sm text-gray-400">You'll need a wallet with USDC on Base network</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <MintFlow />
          <UserDashboard address={address!} />
        </div>
      )}
    </div>
  );
} 