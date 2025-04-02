import { Lead, LeadNote, LeadAssignment, Activity } from '@/types/lead';

const mockActivities: Activity[] = [
  {
    id: 1,
    type: 'call',
    date: '2024-03-25',
    time: '14:30',
    description: 'Initial sales call - Discussed product features and pricing',
    status: 'completed',
  },
  {
    id: 2,
    type: 'demo',
    date: '2024-03-27',
    time: '15:00',
    description: 'Product demo scheduled',
    status: 'scheduled',
  },
  {
    id: 3,
    type: 'email',
    date: '2024-03-26',
    time: '09:15',
    description: 'Sent follow-up email with pricing details',
    status: 'completed',
  },
  {
    id: 4,
    type: 'note',
    date: '2024-03-24',
    time: '16:45',
    description: 'Lead contacted through website contact form',
    status: 'completed',
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    company: 'Tech Solutions Pvt Ltd',
    source: 'website',
    status: 'new',
    priority: 'high',
    assignedTo: 'sales1',
    notes: [
      {
        id: '1',
        leadId: '1',
        content: 'Interested in enterprise plan',
        createdBy: 'sales1',
        createdAt: '2024-03-25T10:00:00Z',
        type: 'note'
      }
    ],
    createdAt: '2024-03-25T10:00:00Z',
    lastContactedAt: '2024-03-25T11:00:00Z',
    nextFollowUpAt: '2024-03-26T14:00:00Z',
    budget: '₹50,000 - ₹1,00,000',
    requirements: 'Need custom integration with existing systems',
    tags: ['enterprise', 'urgent'],
    activities: mockActivities,
    location: 'Mumbai',
    progress: 25,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 98765 43211',
    company: 'Digital Marketing Agency',
    source: 'google_ads',
    status: 'contacted',
    priority: 'medium',
    assignedTo: 'sales2',
    notes: [
      {
        id: '4',
        leadId: '2',
        content: 'Looking for bulk pricing',
        createdBy: 'sales2',
        createdAt: '2024-03-24T09:00:00Z',
        type: 'note'
      }
    ],
    createdAt: '2024-03-24T09:00:00Z',
    lastContactedAt: '2024-03-25T10:00:00Z',
    nextFollowUpAt: '2024-03-28T11:00:00Z',
    budget: '₹25,000 - ₹50,000',
    requirements: 'Need multiple user accounts',
    tags: ['bulk', 'marketing'],
    activities: mockActivities,
    location: 'Delhi',
    progress: 40,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 98765 43212',
    company: 'Startup Inc',
    source: 'facebook',
    status: 'qualified',
    priority: 'high',
    assignedTo: 'sales1',
    notes: [
      {
        id: '5',
        leadId: '3',
        content: 'Ready for proposal',
        createdBy: 'sales1',
        createdAt: '2024-03-23T08:00:00Z',
        type: 'note'
      }
    ],
    createdAt: '2024-03-23T08:00:00Z',
    lastContactedAt: '2024-03-25T09:00:00Z',
    nextFollowUpAt: '2024-03-26T16:00:00Z',
    budget: '₹1,00,000+',
    requirements: 'Need full feature set',
    tags: ['startup', 'urgent'],
    activities: mockActivities,
    location: 'Bangalore',
    progress: 60,
  },
];

export const mockNotes: LeadNote[] = [
  {
    id: '1',
    leadId: '1',
    content: 'Initial contact made. Client interested in enterprise features.',
    createdBy: 'sales1',
    createdAt: '2024-03-25T10:00:00Z',
    type: 'call',
  },
  {
    id: '2',
    leadId: '1',
    content: 'Demo scheduled for tomorrow at 3 PM.',
    createdBy: 'sales1',
    createdAt: '2024-03-25T11:00:00Z',
    type: 'note',
  },
  {
    id: '3',
    leadId: '2',
    content: 'Sent pricing information for bulk accounts.',
    createdBy: 'sales2',
    createdAt: '2024-03-25T10:00:00Z',
    type: 'email',
  },
];

export const mockAssignments: LeadAssignment[] = [
  {
    id: '1',
    leadId: '1',
    assignedTo: 'sales1',
    assignedBy: 'admin',
    assignedAt: '2024-03-25T10:00:00Z',
    reason: 'High priority lead',
  },
  {
    id: '2',
    leadId: '2',
    assignedTo: 'sales2',
    assignedBy: 'admin',
    assignedAt: '2024-03-24T09:00:00Z',
    reason: 'Based on expertise',
  },
  {
    id: '3',
    leadId: '3',
    assignedTo: 'sales1',
    assignedBy: 'admin',
    assignedAt: '2024-03-23T08:00:00Z',
    reason: 'Enterprise lead',
  },
];

export const mockSalesTeam = [
  {
    id: 'sales1',
    name: 'Rajesh Kumar',
    email: 'rajesh@quickbid.co.in',
    role: 'sales',
    performance: {
      leadsAssigned: 15,
      leadsConverted: 8,
      conversionRate: 53.33,
    },
  },
  {
    id: 'sales2',
    name: 'Priya Sharma',
    email: 'priya@quickbid.co.in',
    role: 'sales',
    performance: {
      leadsAssigned: 12,
      leadsConverted: 6,
      conversionRate: 50,
    },
  },
]; 