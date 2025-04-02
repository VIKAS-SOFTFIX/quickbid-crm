import { NextResponse } from 'next/server';
import { googleAnalyticsService } from '@/services/googleAnalytics';
import { metaApiService } from '@/services/metaApi';
import { linkedInApiService } from '@/services/linkedinApi';

export async function GET(
  request: Request,
  { params }: any 
) {
  try {
    const { source } = params;
    let leads;

    switch (source) {
      case 'google':
        // Get leads from the last 30 days
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        leads = await googleAnalyticsService.getLeadsFromAnalytics(startDate, endDate);
        break;

      case 'facebook':
        leads = await metaApiService.getFacebookLeads();
        break;

      case 'instagram':
        leads = await metaApiService.getInstagramLeads();
        break;

      case 'linkedin':
        leads = await linkedInApiService.getLeads();
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid source specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error(`Error fetching ${params.source} leads:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${params.source} leads` },
      { status: 500 }
    );
  }
} 