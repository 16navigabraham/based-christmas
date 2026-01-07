/**
 * Utility functions for checking if the Christmas cap creation season is active
 * and calculating countdown to the next season.
 * 
 * The season runs from December 1st to December 25th every year.
 */

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Checks if the current date is within the Christmas cap creation season
 * (December 1-25 of any year)
 */
export function isChristmasSeason(): boolean {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed, December is 11
  const day = now.getDate();
  
  return month === 11 && day >= 1 && day <= 25;
}

/**
 * Gets the next December 1st date
 */
export function getNextDecemberFirst(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  
  // If we're before December 1st, use this year
  // If we're in December after the 25th, or past December, use next year
  let targetYear = currentYear;
  if (month === 11 && day > 25) {
    // After Christmas, use next year
    targetYear = currentYear + 1;
  } else if (month > 11 || (month === 11 && day > 25)) {
    // This shouldn't happen as December is month 11, but keeping for safety
    targetYear = currentYear + 1;
  } else if (month < 11) {
    // Before December, use this year
    targetYear = currentYear;
  } else if (month === 11 && day >= 1 && day <= 25) {
    // Currently in the season, next occurrence is next year
    targetYear = currentYear + 1;
  }
  
  // Create date for December 1st at midnight
  return new Date(targetYear, 11, 1, 0, 0, 0, 0);
}

/**
 * Calculates the time remaining until the next December 1st
 */
export function getCountdownToNextSeason(): CountdownTime {
  const now = new Date();
  const nextDecFirst = getNextDecemberFirst();
  const diffMs = nextDecFirst.getTime() - now.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

/**
 * Formats countdown time to a readable string
 */
export function formatCountdown(countdown: CountdownTime): string {
  const { days, hours, minutes, seconds } = countdown;
  
  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  }
  
  return parts.join(', ');
}
