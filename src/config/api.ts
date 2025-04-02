export const API_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI,
    scopes: [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/analytics.edit',
    ],
  },
  meta: {
    appId: process.env.META_APP_ID,
    appSecret: process.env.META_APP_SECRET,
    accessToken: process.env.META_ACCESS_TOKEN,
    instagramBusinessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI,
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
    scopes: [
      'r_liteprofile',
      'r_emailaddress',
      'r_organization_social',
      'w_organization_social',
      'rw_organization_admin',
      'rw_ads',
    ],
  },
}; 