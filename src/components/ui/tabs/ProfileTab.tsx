"use client";

import { useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { CHRISTMAS_CAP_ABI, CHRISTMAS_CAP_CONTRACT_ADDRESS } from '~/lib/contracts';
import { ipfsToHttp } from '~/lib/ipfs';
import { Download, Gift, Trophy, Camera, Share2 } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';

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

  const handleSaveOrShare = () => {
    if (!userStats || !userStats[0]) return;
    const imageUrl = ipfsToHttp(userStats[0]);
    window.open(imageUrl, '_blank', 'noopener,noreferrer');
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
                <img
                  src={ipfsToHttp(pfpUrl)}
                  alt="Christmas PFP"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={async () => {
                  const imageUrl = ipfsToHttp(pfpUrl);
                  const castText = 'Staying Based this Christmas with my Basemax Cap! 🎄⛓️ Onchain forever on @base';
                  
                  try {
                    // Use Farcaster SDK - works on iOS and all Farcaster clients
                    await sdk.actions.composeCast({
                      text: castText,
                      embeds: [imageUrl, 'https://farcaster.xyz/miniapps/Rh6KUvzlHqMp/based-christmas']
                    });
                    console.log("Compose cast opened successfully");
                  } catch (sdkError) {
                    console.error("Farcaster SDK failed, opening Warpcast...", sdkError);
                    
                    // Fallback: Open Warpcast compose (for non-Farcaster browsers)
                    const encodedText = encodeURIComponent(castText);
                    const miniAppUrl = 'https://farcaster.xyz/miniapps/Rh6KUvzlHqMp/based-christmas';
                    const castUrl = `https://warpcast.com/~/compose?text=${encodedText}&embeds[]=${encodeURIComponent(imageUrl)}&embeds[]=${encodeURIComponent(miniAppUrl)}`;
                    window.location.href = castUrl;
                  }
                }}
                className="w-full mt-4 px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Cast to Farcaster
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
