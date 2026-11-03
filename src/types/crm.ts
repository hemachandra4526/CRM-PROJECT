export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface WorkflowStageInfo {
  id: StageId;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
}

export const WORKFLOW_STAGES: Record<StageId, WorkflowStageInfo> = {
  1: {
    id: 1,
    name: 'CAPTURE',
    tagline: 'Collect details',
    description: 'Initial intake of lead coordinates, stakeholder origin, and ecosystem alignment.',
    accentColor: '#0284c7' // sky-600
  },
  2: {
    id: 2,
    name: 'QUALIFY',
    tagline: 'Assess potential',
    description: 'Evaluate fit, strategic relevance, decision maker authority, and budget readiness.',
    accentColor: '#2563eb' // blue-600
  },
  3: {
    id: 3,
    name: 'CONTACT',
    tagline: 'Create profile',
    description: 'Synthesize comprehensive contact profile with organization mapping and ecosystem roles.',
    accentColor: '#4f46e5' // indigo-600
  },
  4: {
    id: 4,
    name: 'ENGAGE',
    tagline: 'Record interaction',
    description: 'Conduct discussions, discovery workshops, product demos, and log detailed meeting notes.',
    accentColor: '#7c3aed' // violet-600
  },
  5: {
    id: 5,
    name: 'FOLLOW-UP',
    tagline: 'Schedule action',
    description: 'Calendar concrete action items, stakeholder agendas, follow-up deadlines, and reminders.',
    accentColor: '#d97706' // amber-600
  },
  6: {
    id: 6,
    name: 'OPPORTUNITY',
    tagline: 'Track deal',
    description: 'Formulate commercial deal specifications, projected ARR/value, and win probability.',
    accentColor: '#e11d48' // rose-600 (highlighted in red in image 1)
  },
  7: {
    id: 7,
    name: 'PIPELINE',
    tagline: 'Monitor stage',
    description: 'Track deal movement through negotiation milestones, legal reviews, and procurement checks.',
    accentColor: '#ea580c' // orange-600
  },
  8: {
    id: 8,
    name: 'CONVERT',
    tagline: 'Mark outcome',
    description: 'Execute agreements, mark outcome as Won/Lost, and initiate customer onboarding sequence.',
    accentColor: '#16a34a' // green-600
  },
  9: {
    id: 9,
    name: 'RETAIN',
    tagline: 'Grow relationship',
    description: 'Drive ongoing stakeholder satisfaction, quarterly business reviews, expansions, and ecosystem advocacy.',
    accentColor: '#0d9488' // teal-600
  }
};

export type EcosystemRole = 
  | 'Enterprise Client'
  | 'Ecosystem Partner'
  | 'Early-Stage Founder'
  | 'Strategic Investor'
  | 'Executive Mentor'
  | 'Technology Vendor';

export type ContactStatus = 'Active' | 'Nurturing' | 'Won' | 'Lost' | 'Archived';

export interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  ecosystemRole: EcosystemRole;
  stageId: StageId;
  status: ContactStatus;
  score: number; // 0-100 fit rating
  dealValue: number; // USD
  source: string;
  owner: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt: string;
  nextFollowUpDate?: string;
  tags: string[];
}

export type InteractionType = 'Call' | 'Meeting' | 'Email' | 'Note' | 'Demo' | 'Proposal' | 'WhatsApp';
export type SentimentType = 'Positive' | 'Neutral' | 'Concern' | 'Excited';

export interface Interaction {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  type: InteractionType;
  title: string;
  summary: string;
  outcome?: string;
  sentiment?: SentimentType;
  loggedBy: string;
  timestamp: string;
  stageAtInteraction: StageId;
  followUpRequired: boolean;
  nextAction?: string;
}

export type DealStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Contract Sent' | 'Closed Won' | 'Closed Lost';

export interface Deal {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number; // 0 to 100
  expectedCloseDate: string;
  solutions: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskType = 'Call' | 'Meeting' | 'Follow-up' | 'Email' | 'Review' | 'Contract';

export interface TaskItem {
  id: string;
  contactId?: string;
  contactName?: string;
  company?: string;
  title: string;
  dueDate: string;
  dueTime?: string;
  priority: TaskPriority;
  type: TaskType;
  completed: boolean;
  completedAt?: string;
  assignedTo: string;
  notes?: string;
}

export interface CRMMetrics {
  totalContacts: number;
  activeLeads: number;
  totalPipelineValue: number;
  closedWonValue: number;
  winRate: number;
  pendingFollowUpsCount: number;
  stageDistribution: {
    stageId: StageId;
    name: string;
    tagline: string;
    count: number;
    totalValue: number;
  }[];
  ecosystemDistribution: {
    role: EcosystemRole;
    count: number;
  }[];
}
