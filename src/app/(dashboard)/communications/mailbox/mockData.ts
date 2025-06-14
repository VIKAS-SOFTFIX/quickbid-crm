import { Email, EmailAccount, EmailTag } from './types';

// Mock email tags
export const mockTags: EmailTag[] = [
  { id: '1', name: 'Important', color: '#f44336' }, // red
  { id: '2', name: 'Work', color: '#2196f3' },     // blue
  { id: '3', name: 'Personal', color: '#4caf50' }, // green
  { id: '4', name: 'Urgent', color: '#ff9800' },   // orange
  { id: '5', name: 'Follow-up', color: '#9c27b0' }, // purple
];

// Mock data for emails
export const mockEmails: Email[] = [
  {
    id: '1',
    from: 'john.doe@example.com',
    to: 'me@company.com',
    cc: 'team@company.com',
    subject: 'Project Update',
    body: 'Hello,\n\nHere is the latest update on our project. We have completed the first phase and are moving to the next steps.\n\nPlease review the attached documents and provide your feedback.\n\nRegards,\nJohn',
    date: '2023-06-15T10:30:00',
    read: true,
    starred: false,
    folder: 'inbox',
    tags: [mockTags[1]], // Work
    attachments: [
      { id: '1-1', name: 'project-update.pdf', size: 2500000, type: 'application/pdf' },
      { id: '1-2', name: 'timeline.xlsx', size: 1200000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    ]
  },
  {
    id: '2',
    from: 'alice.smith@example.com',
    to: 'me@company.com',
    subject: 'Meeting Tomorrow',
    body: 'Just a reminder about our meeting tomorrow at 10 AM. Please prepare your presentation and bring the necessary documents.\n\nLooking forward to seeing you there!\n\nBest,\nAlice',
    date: '2023-06-14T15:45:00',
    read: false,
    starred: true,
    folder: 'inbox',
    tags: [mockTags[0], mockTags[4]] // Important, Follow-up
  },
  {
    id: '3',
    from: 'me@company.com',
    to: 'robert.brown@example.com',
    cc: 'manager@company.com',
    subject: 'Proposal Draft',
    body: 'Hi Robert,\n\nI\'ve attached the proposal draft for your review. Please let me know if you have any suggestions or changes.\n\nThanks,\nMe',
    date: '2023-06-13T09:15:00',
    read: true,
    starred: false,
    folder: 'sent',
    attachments: [
      { id: '3-1', name: 'proposal-v1.docx', size: 1800000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ]
  },
  {
    id: '4',
    from: 'me@company.com',
    to: 'sarah.wilson@example.com',
    bcc: 'private@company.com',
    subject: 'Follow-up on Client Meeting',
    body: 'Hi Sarah,\n\nHere\'s a follow-up on our discussion with the client yesterday. I\'ve summarized the key points and action items.\n\nLet\'s connect tomorrow to discuss next steps.\n\nRegards,\nMe',
    date: '2023-06-12T14:20:00',
    read: true,
    starred: true,
    folder: 'sent',
    tags: [mockTags[4]] // Follow-up
  },
  {
    id: '5',
    from: 'me@company.com',
    to: 'david.johnson@example.com',
    subject: 'Product Roadmap',
    body: 'Draft of product roadmap for Q3...\n\nThis is still a work in progress. I\'ll finalize it after our team meeting on Friday.',
    date: '2023-06-11T11:05:00',
    read: true,
    starred: false,
    folder: 'drafts',
    tags: [mockTags[1]] // Work
  },
  {
    id: '6',
    from: 'support@vendor.com',
    to: 'me@company.com',
    subject: 'Your Support Ticket #45678',
    body: 'Dear Customer,\n\nThank you for contacting our support team. Your ticket #45678 has been received and is being processed.\n\nWe will get back to you within 24 hours.\n\nBest regards,\nSupport Team',
    date: '2023-06-10T16:30:00',
    read: false,
    starred: false,
    folder: 'inbox',
    tags: [mockTags[3]] // Urgent
  },
  {
    id: '7',
    from: 'newsletter@tech-news.com',
    to: 'me@company.com',
    subject: 'This Week in Tech: Latest Updates',
    body: 'This Week in Tech\n\n- New AI developments revolutionize healthcare\n- Top 5 programming languages for 2023\n- Cloud computing trends to watch\n\nClick to read more...',
    date: '2023-06-09T08:45:00',
    read: true,
    starred: false,
    folder: 'inbox'
  }
];

// Email business accounts for selection
export const businessEmails: EmailAccount[] = [
  { 
    id: '1', 
    email: 'sales@company.com', 
    name: 'Sales', 
    isLoggedIn: true,
    smtpHost: 'smtp.company.com',
    smtpPort: '587',
    imapHost: 'imap.company.com',
    imapPort: '993',
    useSsl: true
  },
  { 
    id: '2', 
    email: 'support@company.com', 
    name: 'Support', 
    isLoggedIn: true,
    smtpHost: 'smtp.company.com',
    smtpPort: '587',
    imapHost: 'imap.company.com',
    imapPort: '993',
    useSsl: true
  },
  { 
    id: '3', 
    email: 'info@company.com', 
    name: 'Information', 
    isLoggedIn: false,
    smtpHost: '',
    smtpPort: '',
    imapHost: '',
    imapPort: '',
    useSsl: false
  },
  { 
    id: '4', 
    email: 'marketing@company.com', 
    name: 'Marketing', 
    isLoggedIn: false,
    smtpHost: '',
    smtpPort: '',
    imapHost: '',
    imapPort: '',
    useSsl: false
  },
]; 