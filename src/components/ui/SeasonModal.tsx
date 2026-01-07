'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { 
  getCountdownToNextSeason, 
  formatCountdown, 
  type CountdownTime,
  getNextDecemberFirst 
} from '~/lib/seasonCheck';

interface SeasonModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

/**
 * SeasonModal displays when the Christmas cap creation period is not active.
 * Shows a countdown to the next December 1st.
 * 
 * The app is only available December 1-25 each year.
 */
export function SeasonModal({ isOpen, onClose }: SeasonModalProps) {
  const [countdown, setCountdown] = useState<CountdownTime>(getCountdownToNextSeason());
  const [nextDate, setNextDate] = useState<Date>(getNextDecemberFirst());

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown(getCountdownToNextSeason());
      setNextDate(getNextDecemberFirst());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const formattedCountdown = formatCountdown(countdown);
  const nextSeasonYear = nextDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  
  // Determine which year's season just ended
  // If we're after Dec 25 or before Dec 1, the previous Christmas season was last year
  const endedSeasonYear = (currentMonth === 11 && currentDay <= 25) 
    ? currentYear // Currently in season, shouldn't show modal
    : (currentMonth === 11 && currentDay > 25) 
      ? currentYear // Just ended this year's season
      : currentYear - 1; // We're in Jan-Nov, so last season was previous year

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900 border-2 border-blue-400/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl shadow-blue-500/20">
        {/* Close button - only show if onClose is provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="text-7xl">🎅🎄</div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Season&apos;s Over for {endedSeasonYear}!
            </h2>
            <p className="text-gray-300">
              Creating Christmas Base Caps for {endedSeasonYear} has ended
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Countdown */}
          <div className="space-y-3">
            <p className="text-lg text-gray-300">
              Come back on December 1st, {nextSeasonYear}
            </p>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">Next season starts in:</p>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {formattedCountdown}
              </div>
            </div>

            <p className="text-sm text-gray-400">
              The app is available every year from December 1st - 25th
            </p>
          </div>

          {/* Info */}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              💡 Bookmark this page and return during the festive season to create your Christmas PFP!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
