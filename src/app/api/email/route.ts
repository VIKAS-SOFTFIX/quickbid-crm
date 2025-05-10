import { NextResponse } from 'next/server';
import { EmailClient } from "@azure/communication-email";
import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

// Get connection string from environment variables
const connectionString = "endpoint=https://aes-qb-mkt.india.communication.azure.com/;accesskey=5UJD38oatwiblSzBv4LBo89OBpobXeNdRvjbQA4qLrc3HlSvxVobJQQJ99BEACULyCph9wJ9AAAAAZCSjRbX";

export async function POST(request: Request) {
  try {
    if (!connectionString) {
      return NextResponse.json(
        { error: 'Azure Communication Services connection string not configured' },
        { status: 500 }
      );
    }

    const client = new EmailClient(connectionString);
    
    // Parse the FormData
    const formData = await request.formData();
    
    const subject = formData.get('subject') as string;
    const plainText = formData.get('plainText') as string;
    const htmlContent = formData.get('htmlContent') as string;
    const senderAddress = formData.get('senderAddress') as string;
    const recipientsJson = formData.get('recipients') as string;
    const recipients = JSON.parse(recipientsJson) as { address: string }[];
    
    if (!subject || !recipients || recipients.length === 0 || !senderAddress) {
      return NextResponse.json(
        { error: 'Required email parameters missing' },
        { status: 400 }
      );
    }
    
    // Process attachments
    const attachments = [];
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'email-attachments-'));
    
    // Find all attachment entries in the form data
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('attachment_') && value instanceof Blob) {
        const fileName = (value as any).name || `attachment_${key.split('_')[1]}.bin`;
        const filePath = path.join(tempDir, fileName);
        
        // Write the file to disk temporarily
        const buffer = Buffer.from(await value.arrayBuffer());
        await fs.writeFile(filePath, buffer);
        
        // Add to attachments array
        attachments.push({
          name: fileName,
          contentType: value.type || 'application/octet-stream',
          contentInBase64: buffer.toString('base64')
        });
      }
    }
    
    // Create email message
    const emailMessage = {
      senderAddress,
      content: {
        subject,
        plainText: plainText || '',
        html: htmlContent || `<html><body>${plainText}</body></html>`,
      },
      recipients: {
        to: recipients,
      },
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    // Send email
    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();

    // Clean up temp files
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error cleaning up temp files:', error);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully sent email to ${recipients.length} recipients`,
      result 
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
} 