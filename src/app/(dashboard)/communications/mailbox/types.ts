export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
  smtpHost: string;
  smtpPort: string;
  imapHost: string;
  imapPort: string;
  useSsl: boolean;
  provider?: string;
  authType?: 'password' | 'oauth2';
  credentials?: {
    password?: string;
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: string;
  };
}

export interface EmailRecipient {
  name: string;
  email: string;
}

export interface EmailBody {
  html: string;
  text: string;
}

export interface Email {
  id: string;
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: string;
  tags?: EmailTag[];
  attachments?: Attachment[];
}

export interface EmailTag {
  id: string;
  name: string;
  color: string;
}

// Renamed from EmailAttachment to match API naming convention
export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface ComposeEmailData {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  tags: EmailTag[];
  attachments: Attachment[];
}

export interface EmailAccountFormData {
  name: string;
  email: string;
  password: string;
  smtpHost: string;
  smtpPort: string;
  imapHost: string;
  imapPort: string;
  useSsl: boolean;
}

export interface Folder {
  id: string;
  name: string;
  type: 'system' | 'custom';
  count?: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

// System folder names
export enum SystemFolders {
  INBOX = 'inbox',
  SENT = 'sent',
  DRAFTS = 'drafts',
  TRASH = 'trash',
  ARCHIVE = 'archive',
}

// Email search parameters
export interface EmailSearchParams {
  page?: number;
  limit?: number;
  folder?: string;
  unread?: boolean;
  starred?: boolean;
  from?: string;
  to?: string;
  subject?: string;
  after?: string;
  before?: string;
  hasAttachments?: boolean;
} 