import { NextResponse } from 'next/server';
import { googleAnalyticsService } from '@/services/googleAnalytics';

export async function GET() {
  try {
    const authUrl = await googleAnalyticsService.getAuthUrl();
    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating Google auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
} 