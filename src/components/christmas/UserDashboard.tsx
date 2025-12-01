'use client';

import { useReadContract } from 'wagmi';
import { CHRISTMAS_CAP_ABI, CHRISTMAS_CAP_CONTRACT_ADDRESS } from '@/lib/contracts';
import Image from 'next/image';

interface UserDashboardProps {
  address: `0x${string}`;
}

export function UserDashboard({ address }: UserDashboardProps) {
  const { data: userPFP, isLoading } = useReadContract({
    address: CHRISTMAS_CAP_CONTRACT_ADDRESS,
    abi: CHRISTMAS_CAP_ABI,
    functionName: 'userPFP',
    args: [address],
  });

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Your Christmas PFPs</h2>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-xl bg-white/10 h-32 w-32"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const pfpUrl = userPFP as string;

  if (!pfpUrl || pfpUrl === '') {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Your Christmas PFPs 🎅
      </h2>
      <div className="grid gap-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-400/50 transition-all">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-400/50 shadow-lg shadow-blue-500/20">
              <Image
                src={pfpUrl}
                alt="Your Christmas PFP"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Latest Christmas PFP</h3>
              <p className="text-sm text-gray-400 mb-4 break-all">{pfpUrl}</p>
              <div className="flex gap-2 flex-wrap">
                <a
                  href={pfpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
                >
                  View Full Size
                </a>
                <a
                  href={pfpUrl}
                  download="christmas-pfp.png"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}