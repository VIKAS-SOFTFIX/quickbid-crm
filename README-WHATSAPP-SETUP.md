# WhatsApp Messaging Setup

This document provides instructions for setting up the WhatsApp messaging functionality using the Meta WhatsApp Business API in the QuickBid CRM.

## Prerequisites

1. A Meta Business account
2. A verified WhatsApp Business account
3. Access to the Meta Developer Portal
4. An approved WhatsApp Business API application

## Setup Steps

1. **Create a .env.local file in the project root**

   Add the following environment variables to your .env.local file:

   ```
   # Meta API Configuration
   META_APP_ID=your_meta_app_id
   META_APP_SECRET=your_meta_app_secret
   META_ACCESS_TOKEN=your_permanent_access_token
   WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
   WHATSAPP_BUSINESS_ID=your_whatsapp_business_account_id
   WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token
   ```

2. **Get Required Credentials**

   - **Meta App ID and App Secret**: Create an app in the [Meta Developer Portal](https://developers.facebook.com/)
   - **Access Token**: Generate a permanent access token with the required permissions:
     - `whatsapp_business_messaging`
     - `whatsapp_business_management`
   - **WhatsApp Phone Number ID**: The ID of your registered WhatsApp phone number
   - **WhatsApp Business ID**: Your WhatsApp Business Account ID

3. **Message Templates**

   For sending templated messages, you need to:
   
   1. Create and submit templates in the Meta Business Manager
   2. Wait for template approval
   3. Use approved templates in the WhatsApp messaging interface

## Features

1. **Direct Messaging**
   - Send text messages to any WhatsApp number
   - View message delivery status
   - Support for rich text formatting

2. **Template Messaging**
   - Use pre-approved message templates
   - Support for dynamic variables in templates
   - Media-rich templates (images, videos, documents)

3. **Contact Management**
   - Synchronize contacts from CRM leads
   - Search and filter contacts
   - View messaging history with contacts

## Usage

1. Navigate to the WhatsApp Messaging page in the CRM
2. Select a contact or enter a phone number
3. Type a message or select a template
4. Send and track your messages

## Webhook Setup (For Receiving Messages)

To receive incoming messages, you'll need to configure webhooks:

1. **Make your webhook publicly accessible**
   
   For development, use ngrok to expose your local server:
   
   ```bash
   # Install ngrok if you haven't already
   npm install -g ngrok
   
   # Start your Next.js development server
   npm run dev
   
   # In a separate terminal, start ngrok to expose port 3000
   ngrok http 3000
   ```
   
   ngrok will provide a public URL like `https://1234abcd.ngrok.io` that forwards to your local server.

2. **Set up a webhook endpoint in your application**
   - The webhook endpoint is already implemented at `/api/webhook/whatsapp`
   - Add a secure random string as your `WHATSAPP_VERIFY_TOKEN` in your .env.local file
   - Your full webhook URL will be `https://your-ngrok-url/api/webhook/whatsapp`

3. **Configure the webhook in the Meta Developer Portal**
   - Go to your app in the [Meta Developer Portal](https://developers.facebook.com/)
   - Navigate to your app > WhatsApp > Configuration
   - In the Webhooks section, click "Edit"
   - Enter your webhook URL (e.g., `https://1234abcd.ngrok.io/api/webhook/whatsapp`)
   - Enter the same verify token you set in your .env.local file
   - Subscribe to these fields at minimum: `messages`, `message_deliveries`, `message_reads`

4. **Verify your webhook**
   - Meta will send a verification request to your webhook URL
   - Your webhook should respond with the challenge code
   - Check your server logs for any verification issues
   - Use the "Check Webhook Status" button in the Webhook Setup tab

5. **Subscribe your app to the WhatsApp Business Account**
   - Use the "Update Webhook Subscription" button in the Webhook Setup tab
   - Alternatively, call this Graph API endpoint:
     ```
     POST https://graph.facebook.com/v18.0/{whatsapp-business-account-id}/subscribed_apps
     ```

6. **Test the webhook**
   - Send a test message to your WhatsApp Business number
   - Check your server logs to see if the message is received
   - Try the "Send Test Message" button and reply to it

## Troubleshooting Webhook Issues

### Common Webhook Problems:

1. **Webhook Verification Failing**
   - Check that your WHATSAPP_VERIFY_TOKEN matches exactly what you entered in Meta Developer Portal
   - Ensure your webhook endpoint is publicly accessible
   - Verify your server is running and the webhook route is working
   - Check server logs during the verification attempt

2. **Messages Not Being Received**
   - Verify the webhook URL is correctly configured
   - Check that you've subscribed to the 'messages' webhook field
   - Ensure your Meta app is subscribed to your WhatsApp Business Account
   - Restart your ngrok tunnel if needed (URL changes each time)
   - Test by sending a message to your WhatsApp Business number

3. **Webhook Shows as Verified but No Messages Coming Through**
   - Check the "Webhook fields" section and ensure you're subscribed to 'messages'
   - Verify your access token has the 'whatsapp_business_messaging' permission
   - Check Meta Developer Portal > Webhooks section for any error notifications
   - Ensure you've completed step 5 above (subscribing your app)

4. **Access Token Issues**
   - Token might be expired or invalid
   - Check that it has the required permissions
   - Generate a new permanent token if needed

5. **Technical Validation**
   - Use the "Check Webhook Status" button in the CRM
   - Check server logs for webhook verification attempts
   - Try using the Meta API debugger to test your token
   - Check the Network tab in browser dev tools for API errors

## Resources

- [Meta WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Webhooks Documentation](https://developers.facebook.com/docs/graph-api/webhooks)
- [ngrok Documentation](https://ngrok.com/docs)
- [WhatsApp Business Platform](https://business.whatsapp.com/)
- [Meta Developer Portal](https://developers.facebook.com/) 