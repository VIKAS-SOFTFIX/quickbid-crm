import { NextResponse } from 'next/server';
import { googleAnalyticsService } from '@/services/googleAnalytics';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const tokens = await googleAnalyticsService.handleCallback(code);
    return NextResponse.json({ success: true, tokens });
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return NextResponse.json(
      { error: 'Failed to handle authentication callback' },
      { status: 500 }
    );
  }
} 