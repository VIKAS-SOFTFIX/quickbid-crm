import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';
import { metaApiService } from '@/services/metaApi';

export async function GET(request: Request) {
  // Parse the URL to get query parameters
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  console.log('Webhook verification request received:');
  console.log('Mode:', mode);
  console.log('Token:', token);
  console.log('Challenge:', challenge);

  // Define your verify token (should be the same as configured in Meta Developer Portal)
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token';
  console.log('Expected verify token:', VERIFY_TOKEN);

  // Check if this is a verification request
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    return new NextResponse(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // If verification fails
  console.log('Webhook verification failed');
  return new NextResponse('Verification Failed', { status: 403 });
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Received webhook data:', JSON.stringify(body, null, 2));

    // Check if this is a WhatsApp message
    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry.length > 0) {
        const entry = body.entry[0];
        
        if (entry.changes && entry.changes.length > 0) {
          const change = entry.changes[0];
          
          // Handle incoming messages
          if (change.value && change.value.messages && change.value.messages.length > 0) {
            const message = change.value.messages[0];
            const from = message.from; // Phone number of the sender
            const messageId = message.id;
            let messageContent = '';
            
            // Extract message content based on type
            if (message.type === 'text') {
              messageContent = message.text.body;
            } else if (message.type === 'image') {
              messageContent = '[Image received]';
            } else if (message.type === 'audio') {
              messageContent = '[Audio received]';
            } else if (message.type === 'document') {
              messageContent = '[Document received]';
            } else {
              messageContent = `[${message.type} received]`;
            }
            
            console.log(`Message from ${from}: ${messageContent}`);
            
            // Send an automatic response
            try {
              await metaApiService.sendWhatsAppTextMessage(
                from, 
                `Thank you for your message: "${messageContent}". Our team will get back to you shortly.`
              );
              console.log('Auto-response sent successfully to:', from);
            } catch (error) {
              console.error('Error sending auto-response:', error);
            }
          }
          
          // Handle message status updates (delivered, read)
          if (change.value && change.value.statuses && change.value.statuses.length > 0) {
            const status = change.value.statuses[0];
            console.log(`Message status update: ID ${status.id} is now ${status.status}`);
            // You can update your database with this status information
          }
        }
      }
      
      // Return a 200 OK to acknowledge receipt of the event
      return new NextResponse('EVENT_RECEIVED', { status: 200 });
    }
    
    // If not a WhatsApp message
    return new NextResponse('Not a WhatsApp message', { status: 400 });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
} 