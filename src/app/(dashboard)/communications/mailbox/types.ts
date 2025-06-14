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
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive';
  tags?: EmailTag[];
  attachments?: EmailAttachment[];
}

export interface EmailTag {
  id: string;
  name: string;
  color: string;
}

export interface EmailAttachment {
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
  attachments: EmailAttachment[];
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