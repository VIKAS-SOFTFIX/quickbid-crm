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
    appId: "521705221031688",
    accessToken:"EABzVY3dVDHkBO2KsFU5BclA4xLCn4nQHDecWXUq4jD9UsdKK3NBRh7ZADjMysbpDrNdVcbArRmNyjL74R2kfEwuI4NENxdRN8joczUh1SW8S2HGxaAcZC9lrEXoXGAwEEPlNsBNMmZC6GFisdcnZA6ZASYOibv0Tm3ZAWFNdJIAcGa2ZA4DcEt8NxeeEzGDVtU0vQZDZD",
    whatsappPhoneNumberId: 549700231566477,
    whatsappBusinessId:521705221031688,
    instagramBusinessAccountId: null,
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