import { google } from 'googleapis';
import { API_CONFIG } from '@/config/api';

class GoogleAnalyticsService {
  private analytics;
  private auth;

  constructor() {
    this.auth = new google.auth.OAuth2(
      API_CONFIG.google.clientId,
      API_CONFIG.google.clientSecret,
      API_CONFIG.google.redirectUri
    );

    this.analytics = google.analyticsdata('v1beta');
  }

  async getLeadsFromAnalytics(startDate: string, endDate: string) {
    try {
      const response = await this.analytics.properties.runReport({
        property: `properties/${process.env.GA4_PROPERTY_ID}`,
        requestBody: {
          dateRanges: [
            {
              startDate,
              endDate,
            },
          ],
          dimensions: [
            { name: 'userEmail' },
            { name: 'userName' },
            { name: 'userPhone' },
            { name: 'userCompany' },
            { name: 'source' },
            { name: 'medium' },
          ],
          metrics: [
            { name: 'activeUsers' },
            { name: 'conversions' },
          ],
        },
      });

      return this.transformAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      throw error;
    }
  }

  private transformAnalyticsData(data: any) {
    if (!data.rows) return [];

    return data.rows.map((row: any) => ({
      id: `g_${row.dimensionValues[0].value}`,
      name: row.dimensionValues[1].value,
      email: row.dimensionValues[0].value,
      phone: row.dimensionValues[2].value,
      company: row.dimensionValues[3].value,
      source: 'google',
      createdAt: new Date().toISOString(),
      metadata: {
        source: row.dimensionValues[4].value,
        medium: row.dimensionValues[5].value,
        activeUsers: row.metricValues[0].value,
        conversions: row.metricValues[1].value,
      },
    }));
  }

  async getAuthUrl() {
    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: API_CONFIG.google.scopes,
    });
  }

  async handleCallback(code: string) {
    const { tokens } = await this.auth.getToken(code);
    this.auth.setCredentials(tokens);
    return tokens;
  }
}

export const googleAnalyticsService = new GoogleAnalyticsService(); 