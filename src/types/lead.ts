export type LeadSource = 
  | 'website'
  | 'google_ads'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'referral'
  | 'other';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type LeadPriority = 'low' | 'medium' | 'high';

export interface Activity {
  id: number;
  type: 'call' | 'demo' | 'email' | 'note' | 'reminder' | 'training' | 'callback' | 'demo_booking';
  date: string;
  time: string;
  description: string;
  status: 'completed' | 'scheduled';
  followUpDate?: string;
  // Demo booking specific fields
  demoType?: 'online' | 'in_person';
  attendees?: string[];
  duration?: string;
  requirements?: string;
  // Callback specific fields
  preferredTime?: string;
  callbackReason?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  priority: string;
  source: string;
  assignedTo: string;
  budget: string;
  requirements: string;
  notes: LeadNote[];
  tags: string[];
  activities: Activity[];
  location: string;
  createdAt: string;
  progress: number;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
}

export interface LeadNote {
  id: string;
  leadId: string;
  content: string;
  createdBy: string;
  createdAt: string;
  type: 'note' | 'call' | 'email' | 'meeting';
}

export interface LeadAssignment {
  id: string;
  leadId: string;
  assignedTo: string;
  assignedBy: string;
  assignedAt: string;
  reason?: string;
}

export interface LeadFilter {
  status?: LeadStatus[];
  source?: LeadSource[];
  priority?: LeadPriority[];
  assignedTo?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
} 