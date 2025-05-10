# Email Marketing Setup

This document provides instructions for setting up the email marketing functionality using Azure Communication Services in the QuickBid CRM.

## Prerequisites

1. An Azure account with Azure Communication Services provisioned
2. A verified domain in Azure Communication Services for sending emails

## Setup Steps

1. **Create a .env.local file in the project root**

   Copy the following content to your .env.local file and replace the placeholder values with your actual Azure Communication Services credentials:

   ```
   # Azure Communication Services
   COMMUNICATION_SERVICES_CONNECTION_STRING=your_connection_string_here

   # Replace with your verified domain in Azure Communication Services
   EMAIL_SENDER_ADDRESS=DoNotReply@your-domain.com
   ```

2. **Install Dependencies**

   The required packages are already included in the project dependencies, including:
   
   - @azure/communication-email - For sending emails through Azure Communication Services
   - @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link - For rich text editing

3. **Restart the Development Server**

   After setting up the environment variables, restart your development server:

   ```bash
   npm run dev
   ```

## Features

1. **Rich Text Editing**
   - Bold, italic, bullet lists, and link insertion
   - Live preview of formatted content
   - HTML email support

2. **Attachment Support**
   - Upload and attach files to emails (up to 5MB per file)
   - Supported file types: Images (JPEG, PNG, GIF), Documents (PDF, Word, Excel, Text)
   - File validation for size and type

3. **Recipient Management**
   - Add individual email addresses
   - Select recipients from existing leads
   - Manage recipient list with easy removal

## Usage

1. Navigate to the Email Marketing page in the CRM
2. Compose your email with subject and content using the rich text editor
3. Add recipients manually or select from existing leads
4. Add attachments as needed
5. Click "Send Emails" to send the marketing emails in bulk

## Technical Details

- Emails are sent using the Azure Communication Services Email Client
- The frontend interface is built using MUI components and TipTap rich text editor
- File attachments are handled through FormData and converted to base64 for Azure Communication Services
- The sender address must use a verified domain in your Azure Communication Services account

## Troubleshooting

- If emails fail to send, check that your Azure Communication Services connection string is correctly configured
- Ensure your sender domain is verified in Azure Communication Services
- Check the console for any error messages that might indicate configuration issues
- For attachment issues, verify that file sizes are under 5MB and in supported formats 