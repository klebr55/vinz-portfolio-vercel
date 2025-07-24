export function getUserLocale(): string {
  // Implementation to get user's locale
  if (typeof window !== 'undefined') {
    return navigator.language || 'en';
  }
  return 'en'; // Default fallback
}