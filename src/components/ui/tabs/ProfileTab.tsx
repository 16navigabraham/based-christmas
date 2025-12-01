"use client";

import { useAccount, useReadContract } from 'wagmi';
import { CHRISTMAS_CAP_ABI, CHRISTMAS_CAP_CONTRACT_ADDRESS } from '~/lib/contracts';
import { ipfsToHttp } from '~/lib/ipfs';
import Image from 'next/image';
import { Download, Gift, Trophy, Camera } from 'lucide-react';

/**
 * ProfileTab component displays user's Christmas PFP statistics and gallery.
 * 
 * Shows:
 * - Current minted PFP image
 * - Total points earned
 * - Number of mints
 * - Download option for PFP
 */
export function ProfileTab() {
  const { address, isConnected } = useAccount();

  const { data: userStats, isLoading, error } = useReadContract({
    address: CHRISTMAS_CAP_CONTRACT_ADDRESS,
    abi: CHRISTMAS_CAP_ABI,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Download the PFP image
  const handleDownload = async () => {
    if (userStats?.[0]) {
      try {
        const imageUrl = ipfsToHttp(userStats[0]);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'christmas-pfp.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-md">
            <Camera className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400">
              Connect your wallet to view your Christmas PFP profile and stats
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 max-w-md text-center">
            <p className="text-red-400">Error loading profile data</p>
            <p className="text-sm text-gray-400 mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const [pfpUrl, points, mintCount] = userStats || ['', 0n, 0n];
  const hasPFP = pfpUrl && pfpUrl.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
          Your Christmas Profile 🎄
        </h1>
        <p className="text-gray-300">
          View your festive PFP collection and earned rewards
        </p>
      </div>

      {!hasPFP ? (
        /* No PFP Minted Yet */
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-12 text-center">
          <Gift className="w-20 h-20 mx-auto mb-6 text-blue-400" />
          <h2 className="text-2xl font-bold mb-4">No Christmas PFP Yet</h2>
          <p className="text-gray-400 mb-6">
            You haven&apos;t minted your festive profile picture yet. Head to the Home tab to create your first Christmas PFP!
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-blue-400">
            <span>💡</span>
            <span>Mint costs 0.1 USDC and earns you 2 points</span>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* PFP Display */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                Your Festive PFP
              </h2>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                <Image
                  src={ipfsToHttp(pfpUrl)}
                  alt="Christmas PFP"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                onClick={handleDownload}
                className="w-full mt-4 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PFP
              </button>
            </div>


          </div>

          {/* Stats Display */}
          <div className="space-y-4">
            {/* Points Card */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-bold">Total Points</h3>
              </div>
              <p className="text-4xl font-bold text-yellow-400">
                {points.toString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Earned from minting Christmas PFPs
              </p>
            </div>

            {/* Mints Card */}
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Gift className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-bold">Total Mints</h3>
              </div>
              <p className="text-4xl font-bold text-purple-400">
                {mintCount.toString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Christmas PFPs created
              </p>
            </div>

            {/* Stats Summary */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Points per mint</span>
                  <span className="font-bold text-blue-400">2 pts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Cost per mint</span>
                  <span className="font-bold text-green-400">0.1 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Your latest PFP</span>
                  <span className="font-bold text-white">On-chain</span>
                </div>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Your Wallet</p>
              <p className="text-sm font-mono text-blue-400">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">🎁 Make This Christmas Special</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="text-blue-400 font-semibold">✨ Forever Festive</div>
            <p className="text-gray-400">
              Your Christmas moment lives forever on the blockchain - no wrapping paper required!
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-purple-400 font-semibold">🎄 Spread The Joy</div>
            <p className="text-gray-400">
              Download and share your festive PFP across all your social profiles
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-green-400 font-semibold">🎯 Collect Rewards</div>
            <p className="text-gray-400">
              Stack up points with each mint - the more festive, the merrier!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
