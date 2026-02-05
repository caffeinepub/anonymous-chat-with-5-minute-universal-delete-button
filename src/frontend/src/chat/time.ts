import type { Time } from '../backend';

/**
 * Convert backend nanosecond timestamp (bigint) to JavaScript Date
 */
export function timestampToDate(timestamp: Time): Date {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(timestamp / BigInt(1_000_000));
  return new Date(milliseconds);
}

/**
 * Calculate message age in milliseconds
 */
export function getMessageAge(timestamp: Time): number {
  const messageDate = timestampToDate(timestamp);
  return Date.now() - messageDate.getTime();
}

/**
 * Check if message is at least 5 minutes old
 */
export function isMessageDeletable(timestamp: Time): boolean {
  const fiveMinutesInMs = 5 * 60 * 1000;
  return getMessageAge(timestamp) >= fiveMinutesInMs;
}

/**
 * Get time remaining until message becomes deletable (in seconds)
 */
export function getTimeUntilDeletable(timestamp: Time): number {
  const fiveMinutesInMs = 5 * 60 * 1000;
  const ageInMs = getMessageAge(timestamp);
  const remainingMs = fiveMinutesInMs - ageInMs;
  return Math.max(0, Math.ceil(remainingMs / 1000));
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: Time): string {
  const date = timestampToDate(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}
