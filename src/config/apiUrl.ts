// Base URL of the QuickBid support API, ending in /api. Every module that calls the support API reads it
// from here, so NEXT_PUBLIC_API_URL points the whole app at another backend.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.quickbid.co.in/support/api';

// The same URL without the trailing /api, for callers whose paths already start with /api/.
export const API_ROOT_URL = API_BASE_URL.replace(/\/api\/?$/, '');
