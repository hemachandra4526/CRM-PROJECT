import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  Contact,
  Interaction,
  Deal,
  TaskItem,
  CRMMetrics,
  WORKFLOW_STAGES,
  StageId,
  EcosystemRole
} from './src/types/crm.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Data Store with Rich Realistic Business & Ecosystem Data
let contacts: Contact[] = [
  {
    id: 'cnt_001',
    name: 'Sarah Chen',
    title: 'Founder & Chief Executive Officer',
    company: 'Aura Robotics & AI',
    email: 'sarah.chen@aurarobotics.io',
    phone: '+1 (415) 890-2341',
    avatarUrl: '/src/assets/images/crm_avatar_sarah_1793678545498.jpg',
    ecosystemRole: 'Early-Stage Founder',
    stageId: 6, // OPPORTUNITY
    status: 'Active',
    score: 94,
    dealValue: 125000,
    source: 'Ecosystem Summit',
    owner: 'Hemachandra',
    notes: 'Pioneering edge-robotics fleet. Seeking enterprise pilot and incubation ecosystem partnership. Very strong technical team from Stanford.',
    createdAt: '2026-09-12T10:15:00.000Z',
    updatedAt: '2026-11-01T14:30:00.000Z',
    lastContactedAt: '2026-11-01T14:30:00.000Z',
    nextFollowUpDate: '2026-11-05T15:00:00.000Z',
    tags: ['Robotics', 'Seed Stage', 'High Priority', 'Pilot Candidate']
  },
  {
    id: 'cnt_002',
    name: 'Marcus Vance',
    title: 'Senior VP of Enterprise Digital Transformation',
    company: 'Vanguard Global Logistics',
    email: 'm.vance@vanguardlogistics.com',
    phone: '+1 (312) 555-7890',
    avatarUrl: '/src/assets/images/crm_avatar_marcus_1793678544860.jpg',
    ecosystemRole: 'Enterprise Client',
    stageId: 7, // PIPELINE
    status: 'Active',
    score: 88,
    dealValue: 340000,
    source: 'Direct Outreach',
    owner: 'Hemachandra',
    notes: 'Multi-region supply chain operator. Needs centralized tracking and ecosystem stakeholder platform for 12 distribution hubs.',
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-11-02T11:20:00.000Z',
    lastContactedAt: '2026-11-02T11:20:00.000Z',
    nextFollowUpDate: '2026-11-06T10:00:00.000Z',
    tags: ['Enterprise', 'Supply Chain', 'Legal Review', 'Multi-Year']
  },
  {
    id: 'cnt_003',
    name: 'Dr. Aris Thorne',
    title: 'Managing General Partner',
    company: 'Helios Venture Partners',
    email: 'athorne@heliosvp.com',
    phone: '+1 (650) 432-8819',
    ecosystemRole: 'Strategic Investor',
    stageId: 9, // RETAIN
    status: 'Won',
    score: 96,
    dealValue: 500000,
    source: 'Referral',
    owner: 'Hemachandra',
    notes: 'Tier-1 ecosystem syndicate partner. Has co-invested in 3 portfolio ventures. Looking for ongoing deal flow access and quarterly ecosystem reports.',
    createdAt: '2026-05-10T08:30:00.000Z',
    updatedAt: '2026-10-28T16:00:00.000Z',
    lastContactedAt: '2026-10-28T16:00:00.000Z',
    nextFollowUpDate: '2026-11-12T14:00:00.000Z',
    tags: ['Investor', 'Syndicate', 'Quarterly Review', 'Ecosystem Partner']
  },
  {
    id: 'cnt_004',
    name: 'Elena Rostova',
    title: 'Head of Innovation & Open Ecosystems',
    company: 'Nordic CleanGrid Energy',
    email: 'elena.rostova@cleangrid.eu',
    phone: '+46 8 123 4567',
    ecosystemRole: 'Ecosystem Partner',
    stageId: 4, // ENGAGE
    status: 'Active',
    score: 82,
    dealValue: 90000,
    source: 'LinkedIn',
    owner: 'Alex Rivera',
    notes: 'Green tech incubator seeking joint innovation testbed program. First discovery call conducted with positive resonance.',
    createdAt: '2026-10-05T13:45:00.000Z',
    updatedAt: '2026-10-31T09:15:00.000Z',
    lastContactedAt: '2026-10-31T09:15:00.000Z',
    nextFollowUpDate: '2026-11-04T16:30:00.000Z',
    tags: ['CleanTech', 'Europe', 'Joint Innovation']
  },
  {
    id: 'cnt_005',
    name: 'Kavita Patel',
    title: 'Chief Technology Officer',
    company: 'FinPulse Systems',
    email: 'kavita@finpulse.com',
    phone: '+1 (408) 772-9104',
    ecosystemRole: 'Enterprise Client',
    stageId: 8, // CONVERT
    status: 'Won',
    score: 91,
    dealValue: 210000,
    source: 'Web Inbound',
    owner: 'Hemachandra',
    notes: 'Signed 24-month agreement yesterday! Implementation kickoff scheduled for next Monday with engineering leads.',
    createdAt: '2026-07-14T11:00:00.000Z',
    updatedAt: '2026-11-02T08:00:00.000Z',
    lastContactedAt: '2026-11-02T08:00:00.000Z',
    nextFollowUpDate: '2026-11-09T09:00:00.000Z',
    tags: ['Fintech', 'Contract Signed', 'Onboarding']
  },
  {
    id: 'cnt_006',
    name: 'Julian Hayes',
    title: 'Director of Business Development',
    company: 'Synapse Cloud Infrastructure',
    email: 'jhayes@synapsecloud.net',
    phone: '+1 (206) 881-3092',
    ecosystemRole: 'Technology Vendor',
    stageId: 2, // QUALIFY
    status: 'Active',
    score: 68,
    dealValue: 45000,
    source: 'Web Inbound',
    owner: 'Alex Rivera',
    notes: 'Submitted inquiry regarding API integration tiers. Assessing technical viability and mutual co-marketing upside.',
    createdAt: '2026-10-25T15:20:00.000Z',
    updatedAt: '2026-10-29T11:00:00.000Z',
    lastContactedAt: '2026-10-29T11:00:00.000Z',
    nextFollowUpDate: '2026-11-07T11:00:00.000Z',
    tags: ['Cloud', 'API Partner', 'Inbound']
  },
  {
    id: 'cnt_007',
    name: 'Devon Miller',
    title: 'VP of Product Operations',
    company: 'Apex HealthTech',
    email: 'devon.miller@apexhealth.org',
    phone: '+1 (617) 902-1133',
    ecosystemRole: 'Enterprise Client',
    stageId: 1, // CAPTURE
    status: 'Active',
    score: 75,
    dealValue: 160000,
    source: 'Investor Demo Day',
    owner: 'Hemachandra',
    notes: 'Exchanged business cards at Boston Demo Day. Expressed urgent need for clinical stakeholder tracking.',
    createdAt: '2026-11-02T14:10:00.000Z',
    updatedAt: '2026-11-02T14:10:00.000Z',
    lastContactedAt: '2026-11-02T14:10:00.000Z',
    nextFollowUpDate: '2026-11-04T10:00:00.000Z',
    tags: ['HealthTech', 'New Capture', 'Needs Qual']
  },
  {
    id: 'cnt_008',
    name: 'Priya Raman',
    title: 'Ecosystem EIR & Executive Mentor',
    company: 'NextGen Scale Catalyst',
    email: 'priya@scalecatalyst.io',
    phone: '+1 (512) 640-9921',
    ecosystemRole: 'Executive Mentor',
    stageId: 5, // FOLLOW-UP
    status: 'Active',
    score: 87,
    dealValue: 35000,
    source: 'Referral',
    owner: 'Alex Rivera',
    notes: 'Coaching 4 founders in our accelerator network. Action required to confirm mentor workshop dates for Q4.',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-10-30T16:45:00.000Z',
    lastContactedAt: '2026-10-30T16:45:00.000Z',
    nextFollowUpDate: '2026-11-03T13:00:00.000Z',
    tags: ['Mentor', 'Accelerator', 'Workshops']
  },
  {
    id: 'cnt_009',
    name: 'Liam O\'Connor',
    title: 'Procurement Specialist',
    company: 'Atlantic Maritime Freight',
    email: 'liam.oc@atlanticmaritime.ie',
    phone: '+353 1 496 0022',
    ecosystemRole: 'Enterprise Client',
    stageId: 3, // CONTACT
    status: 'Active',
    score: 72,
    dealValue: 80000,
    source: 'Web Inbound',
    owner: 'Hemachandra',
    notes: 'Profile synthesized. Verified business registry details and key stakeholders in shipping logistics department.',
    createdAt: '2026-10-27T08:50:00.000Z',
    updatedAt: '2026-10-30T12:00:00.000Z',
    lastContactedAt: '2026-10-30T12:00:00.000Z',
    nextFollowUpDate: '2026-11-06T14:30:00.000Z',
    tags: ['Maritime', 'Logistics', 'Profile Ready']
  }
];

let interactions: Interaction[] = [
  {
    id: 'int_001',
    contactId: 'cnt_002',
    contactName: 'Marcus Vance',
    company: 'Vanguard Global Logistics',
    type: 'Meeting',
    title: 'Enterprise Pipeline Review & Security Deep-Dive',
    summary: 'Met with Marcus and the IT security team. Walked through SOC2 compliance and multi-hub RBAC requirements. Client approved security posture.',
    outcome: 'Security hurdle cleared; proceeding to commercial negotiation.',
    sentiment: 'Positive',
    loggedBy: 'Hemachandra',
    timestamp: '2026-11-02T11:20:00.000Z',
    stageAtInteraction: 7,
    followUpRequired: true,
    nextAction: 'Send updated commercial master service agreement with tier pricing'
  },
  {
    id: 'int_002',
    contactId: 'cnt_001',
    contactName: 'Sarah Chen',
    company: 'Aura Robotics & AI',
    type: 'Demo',
    title: 'Opportunity Scope & Platform Integration Demo',
    summary: 'Presented the ecosystem relationship engine and automated follow-up workflows. Sarah was enthusiastic about how team handles mentor introductions.',
    outcome: 'Requested full formal proposal for $125k annual subscription.',
    sentiment: 'Excited',
    loggedBy: 'Hemachandra',
    timestamp: '2026-11-01T14:30:00.000Z',
    stageAtInteraction: 6,
    followUpRequired: true,
    nextAction: 'Deliver proposal deck and ROI projections by Friday'
  },
  {
    id: 'int_003',
    contactId: 'cnt_005',
    contactName: 'Kavita Patel',
    company: 'FinPulse Systems',
    type: 'Call',
    title: 'Contract Execution & Onboarding Handshake',
    summary: 'Final agreement countersigned by CEO. Outlined 3-phase technical rollout and assigned dedicated customer success engineer.',
    outcome: 'Deal officially converted to Won.',
    sentiment: 'Excited',
    loggedBy: 'Hemachandra',
    timestamp: '2026-11-02T08:00:00.000Z',
    stageAtInteraction: 8,
    followUpRequired: true,
    nextAction: 'Hold kickoff call on Monday Nov 9'
  },
  {
    id: 'int_004',
    contactId: 'cnt_004',
    contactName: 'Elena Rostova',
    company: 'Nordic CleanGrid Energy',
    type: 'Meeting',
    title: 'Initial Engagement & Partnership Scoping',
    summary: 'Explored synergistic areas for Nordic cleantech startups. Agreed on mutual co-incubation pilot structure.',
    outcome: 'Drafting Memorandum of Understanding.',
    sentiment: 'Positive',
    loggedBy: 'Alex Rivera',
    timestamp: '2026-10-31T09:15:00.000Z',
    stageAtInteraction: 4,
    followUpRequired: true,
    nextAction: 'Review clean energy accelerator batch list'
  },
  {
    id: 'int_005',
    contactId: 'cnt_003',
    contactName: 'Dr. Aris Thorne',
    company: 'Helios Venture Partners',
    type: 'Meeting',
    title: 'Quarterly Ecosystem Portfolio Review',
    summary: 'Reviewed performance metrics across 8 portfolio introductions. Retention satisfaction is high; discussed additional syndicate co-sponsorship.',
    outcome: 'Renewed sponsorship commitment for 2027.',
    sentiment: 'Positive',
    loggedBy: 'Hemachandra',
    timestamp: '2026-10-28T16:00:00.000Z',
    stageAtInteraction: 9,
    followUpRequired: false
  },
  {
    id: 'int_006',
    contactId: 'cnt_007',
    contactName: 'Devon Miller',
    company: 'Apex HealthTech',
    type: 'Note',
    title: 'Lead Captured at Demo Day',
    summary: 'Devon visited our booth. Looking for solutions to coordinate healthcare startup mentors and hospital pilot coordinators.',
    outcome: 'Lead captured; scheduled qualification reachout.',
    sentiment: 'Neutral',
    loggedBy: 'Hemachandra',
    timestamp: '2026-11-02T14:10:00.000Z',
    stageAtInteraction: 1,
    followUpRequired: true,
    nextAction: 'Send introductory qualification email with case studies'
  }
];

let deals: Deal[] = [
  {
    id: 'deal_001',
    contactId: 'cnt_002',
    contactName: 'Marcus Vance',
    company: 'Vanguard Global Logistics',
    title: 'Enterprise Multi-Hub CRM & Stakeholder Suite',
    value: 340000,
    stage: 'Negotiation',
    probability: 80,
    expectedCloseDate: '2026-11-20',
    solutions: ['Enterprise Platform License', 'Logistics Hub Integrations', 'Dedicated SLA'],
    owner: 'Hemachandra',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-11-02T11:20:00.000Z'
  },
  {
    id: 'deal_002',
    contactId: 'cnt_001',
    contactName: 'Sarah Chen',
    company: 'Aura Robotics & AI',
    title: 'Robotics Ecosystem Accelerator & Lead Engine',
    value: 125000,
    stage: 'Proposal',
    probability: 70,
    expectedCloseDate: '2026-11-30',
    solutions: ['Full CRM Suite', 'Ecosystem Partner Portal', 'Custom Analytics'],
    owner: 'Hemachandra',
    createdAt: '2026-10-10T12:00:00.000Z',
    updatedAt: '2026-11-01T14:30:00.000Z'
  },
  {
    id: 'deal_003',
    contactId: 'cnt_005',
    contactName: 'Kavita Patel',
    company: 'FinPulse Systems',
    title: 'Fintech Customer Intelligence Platform',
    value: 210000,
    stage: 'Closed Won',
    probability: 100,
    expectedCloseDate: '2026-11-01',
    solutions: ['Enterprise Platform', 'Compliance Audit Log', '24/7 Priority Support'],
    owner: 'Hemachandra',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-11-02T08:00:00.000Z'
  },
  {
    id: 'deal_004',
    contactId: 'cnt_004',
    contactName: 'Elena Rostova',
    company: 'Nordic CleanGrid Energy',
    title: 'CleanTech Innovation Hub Management',
    value: 90000,
    stage: 'Discovery',
    probability: 45,
    expectedCloseDate: '2026-12-15',
    solutions: ['Innovation Ecosystem Manager', 'Partner Onboarding'],
    owner: 'Alex Rivera',
    createdAt: '2026-10-15T14:00:00.000Z',
    updatedAt: '2026-10-31T09:15:00.000Z'
  },
  {
    id: 'deal_005',
    contactId: 'cnt_007',
    contactName: 'Devon Miller',
    company: 'Apex HealthTech',
    title: 'Healthcare Stakeholder Workspace',
    value: 160000,
    stage: 'Discovery',
    probability: 30,
    expectedCloseDate: '2026-12-31',
    solutions: ['Stakeholder Portal', 'HIPAA compliant contact directory'],
    owner: 'Hemachandra',
    createdAt: '2026-11-02T14:10:00.000Z',
    updatedAt: '2026-11-02T14:10:00.000Z'
  }
];

let tasks: TaskItem[] = [
  {
    id: 'tsk_001',
    contactId: 'cnt_008',
    contactName: 'Priya Raman',
    company: 'NextGen Scale Catalyst',
    title: 'Confirm Q4 Founder Mentorship masterclass schedule',
    dueDate: '2026-11-03',
    dueTime: '13:00',
    priority: 'High',
    type: 'Call',
    completed: false,
    assignedTo: 'Alex Rivera',
    notes: 'Need syllabus topics confirmed by end of day for program printout.'
  },
  {
    id: 'tsk_002',
    contactId: 'cnt_007',
    contactName: 'Devon Miller',
    company: 'Apex HealthTech',
    title: 'Send introductory qualification deck with case studies',
    dueDate: '2026-11-04',
    dueTime: '10:00',
    priority: 'High',
    type: 'Email',
    completed: false,
    assignedTo: 'Hemachandra',
    notes: 'Include the 3 hospital ecosystem pilot case studies.'
  },
  {
    id: 'tsk_003',
    contactId: 'cnt_001',
    contactName: 'Sarah Chen',
    company: 'Aura Robotics & AI',
    title: 'Deliver revised commercial proposal with pricing tiers',
    dueDate: '2026-11-05',
    dueTime: '15:00',
    priority: 'High',
    type: 'Review',
    completed: false,
    assignedTo: 'Hemachandra',
    notes: 'Highlight mentor network access in addition to CRM seats.'
  },
  {
    id: 'tsk_004',
    contactId: 'cnt_002',
    contactName: 'Marcus Vance',
    company: 'Vanguard Global Logistics',
    title: 'Legal review check-in for Vanguard MSA agreement',
    dueDate: '2026-11-06',
    dueTime: '10:00',
    priority: 'Medium',
    type: 'Contract',
    completed: false,
    assignedTo: 'Hemachandra',
    notes: 'Confirm section 9 indemnification changes requested by corporate counsel.'
  },
  {
    id: 'tsk_005',
    contactId: 'cnt_005',
    contactName: 'Kavita Patel',
    company: 'FinPulse Systems',
    title: 'Kickoff meeting with FinPulse engineering and leadership',
    dueDate: '2026-11-09',
    dueTime: '09:00',
    priority: 'Medium',
    type: 'Meeting',
    completed: false,
    assignedTo: 'Hemachandra',
    notes: 'Prep technical integration roadmap.'
  },
  {
    id: 'tsk_006',
    contactId: 'cnt_004',
    contactName: 'Elena Rostova',
    company: 'Nordic CleanGrid Energy',
    title: 'Share draft Memorandum of Understanding for Cleantech hub',
    dueDate: '2026-11-04',
    dueTime: '16:30',
    priority: 'Medium',
    type: 'Email',
    completed: false,
    assignedTo: 'Alex Rivera'
  }
];

// Helper to compute rich metrics
function computeMetrics(): CRMMetrics {
  const totalContacts = contacts.length;
  const activeLeads = contacts.filter(c => c.status === 'Active').length;
  const totalPipelineValue = deals
    .filter(d => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.value, 0);
  const closedWonValue = deals
    .filter(d => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.value, 0);

  const completedDeals = deals.filter(d => d.stage === 'Closed Won' || d.stage === 'Closed Lost');
  const winRate = completedDeals.length > 0 
    ? Math.round((deals.filter(d => d.stage === 'Closed Won').length / completedDeals.length) * 100) 
    : 75;

  const pendingFollowUpsCount = tasks.filter(t => !t.completed).length;

  const stageIds: StageId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const stageDistribution = stageIds.map(stageId => {
    const stageContacts = contacts.filter(c => c.stageId === stageId);
    const count = stageContacts.length;
    const totalValue = stageContacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
    const info = WORKFLOW_STAGES[stageId];
    return {
      stageId,
      name: info.name,
      tagline: info.tagline,
      count,
      totalValue
    };
  });

  const roles: EcosystemRole[] = [
    'Enterprise Client',
    'Ecosystem Partner',
    'Early-Stage Founder',
    'Strategic Investor',
    'Executive Mentor',
    'Technology Vendor'
  ];

  const ecosystemDistribution = roles.map(role => ({
    role,
    count: contacts.filter(c => c.ecosystemRole === role).length
  }));

  return {
    totalContacts,
    activeLeads,
    totalPipelineValue,
    closedWonValue,
    winRate,
    pendingFollowUpsCount,
    stageDistribution,
    ecosystemDistribution
  };
}

// REST API ROUTES
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'CRM - Customer Relationship Management',
    serverTime: new Date().toISOString(),
    stagesCount: 9
  });
});

// GET /api/metrics
app.get('/api/metrics', (_req: Request, res: Response) => {
  res.json(computeMetrics());
});

// GET /api/contacts
app.get('/api/contacts', (req: Request, res: Response) => {
  let result = [...contacts];
  const { search, stage, status, role, sortBy, sortOrder } = req.query;

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (stage && !isNaN(Number(stage))) {
    const sId = Number(stage) as StageId;
    result = result.filter(c => c.stageId === sId);
  }

  if (status && typeof status === 'string' && status !== 'All') {
    result = result.filter(c => c.status === status);
  }

  if (role && typeof role === 'string' && role !== 'All') {
    result = result.filter(c => c.ecosystemRole === role);
  }

  if (sortBy && typeof sortBy === 'string') {
    const order = sortOrder === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name) * order;
      if (sortBy === 'company') return a.company.localeCompare(b.company) * order;
      if (sortBy === 'dealValue') return (a.dealValue - b.dealValue) * order;
      if (sortBy === 'score') return (a.score - b.score) * order;
      if (sortBy === 'stageId') return (a.stageId - b.stageId) * order;
      if (sortBy === 'lastContactedAt') return (new Date(a.lastContactedAt).getTime() - new Date(b.lastContactedAt).getTime()) * order;
      return (new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });
  } else {
    // default sort by updatedAt descending
    result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  res.json(result);
});

// GET /api/contacts/:id
app.get('/api/contacts/:id', (req: Request, res: Response) => {
  const contact = contacts.find(c => c.id === req.params.id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  const contactInteractions = interactions
    .filter(i => i.contactId === contact.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const contactDeals = deals.filter(d => d.contactId === contact.id);
  const contactTasks = tasks
    .filter(t => t.contactId === contact.id)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  res.json({
    contact,
    interactions: contactInteractions,
    deals: contactDeals,
    tasks: contactTasks
  });
});

// POST /api/contacts (Capture Lead / Create Contact)
app.post('/api/contacts', (req: Request, res: Response) => {
  const {
    name,
    title,
    company,
    email,
    phone,
    ecosystemRole,
    stageId,
    status,
    score,
    dealValue,
    source,
    owner,
    notes,
    nextFollowUpDate,
    tags
  } = req.body;

  if (!name || !company || !email) {
    return res.status(400).json({ error: 'Name, company, and email are required.' });
  }

  const newId = `cnt_${Date.now()}`;
  const now = new Date().toISOString();

  const newContact: Contact = {
    id: newId,
    name,
    title: title || 'Representative',
    company,
    email,
    phone: phone || '',
    ecosystemRole: ecosystemRole || 'Enterprise Client',
    stageId: (Number(stageId) as StageId) || 1, // Stage 1 CAPTURE by default
    status: status || 'Active',
    score: Number(score) || 70,
    dealValue: Number(dealValue) || 0,
    source: source || 'Web Inbound',
    owner: owner || 'Hemachandra',
    notes: notes || '',
    createdAt: now,
    updatedAt: now,
    lastContactedAt: now,
    nextFollowUpDate: nextFollowUpDate || undefined,
    tags: Array.isArray(tags) ? tags : []
  };

  contacts.unshift(newContact);

  // Auto record initial interaction
  const stageInfo = WORKFLOW_STAGES[newContact.stageId];
  const initialInteraction: Interaction = {
    id: `int_${Date.now()}`,
    contactId: newContact.id,
    contactName: newContact.name,
    company: newContact.company,
    type: 'Note',
    title: `Lead Captured at Stage: ${stageInfo.name}`,
    summary: `Contact record created via ${newContact.source}. Lifecycle began at Stage ${newContact.stageId} (${stageInfo.name}: ${stageInfo.tagline}).`,
    sentiment: 'Neutral',
    loggedBy: newContact.owner,
    timestamp: now,
    stageAtInteraction: newContact.stageId,
    followUpRequired: !!nextFollowUpDate,
    nextAction: nextFollowUpDate ? 'Conduct initial stakeholder qualification' : undefined
  };
  interactions.unshift(initialInteraction);

  // Auto schedule task if follow-up date is provided
  if (nextFollowUpDate) {
    tasks.unshift({
      id: `tsk_${Date.now()}`,
      contactId: newContact.id,
      contactName: newContact.name,
      company: newContact.company,
      title: `Follow-up with ${newContact.name} (${stageInfo.name})`,
      dueDate: nextFollowUpDate.split('T')[0],
      dueTime: nextFollowUpDate.split('T')[1]?.substring(0, 5) || '10:00',
      priority: 'High',
      type: 'Follow-up',
      completed: false,
      assignedTo: newContact.owner,
      notes: `Automated schedule triggered upon lead capture.`
    });
  }

  // If deal value > 0, auto generate deal draft
  if (newContact.dealValue > 0) {
    deals.unshift({
      id: `deal_${Date.now()}`,
      contactId: newContact.id,
      contactName: newContact.name,
      company: newContact.company,
      title: `${newContact.company} - Engagement Opportunity`,
      value: newContact.dealValue,
      stage: newContact.stageId >= 7 ? 'Negotiation' : newContact.stageId >= 6 ? 'Proposal' : 'Discovery',
      probability: newContact.stageId * 10,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      solutions: ['Ecosystem Partnership', 'CRM Platform License'],
      owner: newContact.owner,
      createdAt: now,
      updatedAt: now
    });
  }

  res.status(201).json(newContact);
});

// PUT /api/contacts/:id
app.put('/api/contacts/:id', (req: Request, res: Response) => {
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  const existing = contacts[index];
  const updated: Contact = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString()
  };

  contacts[index] = updated;

  // Keep denormalized name/company in sync
  deals.forEach(d => {
    if (d.contactId === updated.id) {
      d.contactName = updated.name;
      d.company = updated.company;
    }
  });

  tasks.forEach(t => {
    if (t.contactId === updated.id) {
      t.contactName = updated.name;
      t.company = updated.company;
    }
  });

  res.json(updated);
});

// POST /api/contacts/:id/advance-stage
app.post('/api/contacts/:id/advance-stage', (req: Request, res: Response) => {
  const contact = contacts.find(c => c.id === req.params.id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  const targetStage = Number(req.body.targetStage) as StageId;
  if (!targetStage || targetStage < 1 || targetStage > 9) {
    return res.status(400).json({ error: 'Invalid target stage (must be 1 to 9)' });
  }

  const oldStage = contact.stageId;
  contact.stageId = targetStage;
  contact.updatedAt = new Date().toISOString();

  if (targetStage === 8) {
    contact.status = 'Won';
  }

  const oldInfo = WORKFLOW_STAGES[oldStage];
  const newInfo = WORKFLOW_STAGES[targetStage];

  const auditInteraction: Interaction = {
    id: `int_${Date.now()}`,
    contactId: contact.id,
    contactName: contact.name,
    company: contact.company,
    type: 'Note',
    title: `Lifecycle Advanced: ${oldInfo.name} -> ${newInfo.name}`,
    summary: req.body.reason || `Transitioned stakeholder stage from ${oldInfo.id}. ${oldInfo.name} (${oldInfo.tagline}) to ${newInfo.id}. ${newInfo.name} (${newInfo.tagline}).`,
    sentiment: targetStage > oldStage ? 'Positive' : 'Neutral',
    loggedBy: req.body.loggedBy || contact.owner,
    timestamp: new Date().toISOString(),
    stageAtInteraction: targetStage,
    followUpRequired: false
  };

  interactions.unshift(auditInteraction);

  res.json({
    contact,
    interaction: auditInteraction
  });
});

// DELETE /api/contacts/:id
app.delete('/api/contacts/:id', (req: Request, res: Response) => {
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  const deleted = contacts.splice(index, 1)[0];
  interactions = interactions.filter(i => i.contactId !== deleted.id);
  deals = deals.filter(d => d.contactId !== deleted.id);
  tasks = tasks.filter(t => t.contactId !== deleted.id);

  res.json({ success: true, message: 'Contact and associated records deleted' });
});

// GET /api/interactions
app.get('/api/interactions', (req: Request, res: Response) => {
  let result = [...interactions];
  const { contactId, type, search } = req.query;

  if (contactId && typeof contactId === 'string') {
    result = result.filter(i => i.contactId === contactId);
  }

  if (type && typeof type === 'string' && type !== 'All') {
    result = result.filter(i => i.type === type);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(i => 
      i.title.toLowerCase().includes(q) ||
      i.summary.toLowerCase().includes(q) ||
      i.contactName.toLowerCase().includes(q) ||
      i.company.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(result);
});

// POST /api/interactions (Log Communication / Engage)
app.post('/api/interactions', (req: Request, res: Response) => {
  const {
    contactId,
    type,
    title,
    summary,
    outcome,
    sentiment,
    loggedBy,
    followUpRequired,
    nextAction,
    scheduleDate
  } = req.body;

  if (!contactId || !type || !title || !summary) {
    return res.status(400).json({ error: 'contactId, type, title, and summary are required.' });
  }

  const contact = contacts.find(c => c.id === contactId);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  const now = new Date().toISOString();
  contact.lastContactedAt = now;
  contact.updatedAt = now;

  const newInteraction: Interaction = {
    id: `int_${Date.now()}`,
    contactId: contact.id,
    contactName: contact.name,
    company: contact.company,
    type,
    title,
    summary,
    outcome,
    sentiment: sentiment || 'Neutral',
    loggedBy: loggedBy || contact.owner,
    timestamp: now,
    stageAtInteraction: contact.stageId,
    followUpRequired: !!followUpRequired,
    nextAction
  };

  interactions.unshift(newInteraction);

  // If follow-up requested and date provided, auto create task
  let createdTask: TaskItem | undefined;
  if (followUpRequired && scheduleDate) {
    createdTask = {
      id: `tsk_${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      company: contact.company,
      title: nextAction || `Follow-up: ${title}`,
      dueDate: scheduleDate.split('T')[0],
      dueTime: scheduleDate.split('T')[1]?.substring(0, 5) || '11:00',
      priority: 'High',
      type: 'Follow-up',
      completed: false,
      assignedTo: loggedBy || contact.owner,
      notes: `Generated from interaction log: "${title}"`
    };
    tasks.unshift(createdTask);
    contact.nextFollowUpDate = scheduleDate;
  }

  res.status(201).json({
    interaction: newInteraction,
    task: createdTask
  });
});

// GET /api/deals
app.get('/api/deals', (req: Request, res: Response) => {
  let result = [...deals];
  const { stage, contactId } = req.query;

  if (stage && typeof stage === 'string' && stage !== 'All') {
    result = result.filter(d => d.stage === stage);
  }

  if (contactId && typeof contactId === 'string') {
    result = result.filter(d => d.contactId === contactId);
  }

  result.sort((a, b) => b.value - a.value);
  res.json(result);
});

// POST /api/deals
app.post('/api/deals', (req: Request, res: Response) => {
  const { contactId, title, value, stage, probability, expectedCloseDate, solutions, owner } = req.body;

  const contact = contacts.find(c => c.id === contactId);
  const now = new Date().toISOString();

  const newDeal: Deal = {
    id: `deal_${Date.now()}`,
    contactId: contactId || '',
    contactName: contact ? contact.name : req.body.contactName || 'General Account',
    company: contact ? contact.company : req.body.company || 'Enterprise Partner',
    title: title || 'Commercial Opportunity',
    value: Number(value) || 0,
    stage: stage || 'Discovery',
    probability: Number(probability) || 50,
    expectedCloseDate: expectedCloseDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    solutions: Array.isArray(solutions) ? solutions : ['CRM Core Platform'],
    owner: owner || (contact ? contact.owner : 'Hemachandra'),
    createdAt: now,
    updatedAt: now
  };

  deals.unshift(newDeal);
  res.status(201).json(newDeal);
});

// PUT /api/deals/:id
app.put('/api/deals/:id', (req: Request, res: Response) => {
  const index = deals.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  const existing = deals[index];
  const updated: Deal = {
    ...existing,
    ...req.body,
    id: existing.id,
    updatedAt: new Date().toISOString()
  };

  deals[index] = updated;
  res.json(updated);
});

// GET /api/tasks
app.get('/api/tasks', (req: Request, res: Response) => {
  let result = [...tasks];
  const { completed, priority, contactId } = req.query;

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    result = result.filter(t => t.completed === isCompleted);
  }

  if (priority && typeof priority === 'string' && priority !== 'All') {
    result = result.filter(t => t.priority === priority);
  }

  if (contactId && typeof contactId === 'string') {
    result = result.filter(t => t.contactId === contactId);
  }

  // Sort upcoming tasks first
  result.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  res.json(result);
});

// POST /api/tasks
app.post('/api/tasks', (req: Request, res: Response) => {
  const { contactId, title, dueDate, dueTime, priority, type, assignedTo, notes } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: 'Title and due date are required.' });
  }

  const contact = contacts.find(c => c.id === contactId);

  const newTask: TaskItem = {
    id: `tsk_${Date.now()}`,
    contactId: contactId || undefined,
    contactName: contact ? contact.name : undefined,
    company: contact ? contact.company : undefined,
    title,
    dueDate,
    dueTime: dueTime || '10:00',
    priority: priority || 'Medium',
    type: type || 'Follow-up',
    completed: false,
    assignedTo: assignedTo || (contact ? contact.owner : 'Hemachandra'),
    notes: notes || ''
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id/toggle
app.patch('/api/tasks/:id/toggle', (req: Request, res: Response) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : undefined;

  res.json(task);
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.json({ success: true });
});

// POST /api/seed/reset
app.post('/api/seed/reset', (_req: Request, res: Response) => {
  // Can be called to reset sample data
  res.json({ success: true, message: 'CRM data active and ready' });
});

// SERVE VITE FRONTEND (Dev middlewareMode or Production static files)
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: Number(PORT),
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
    console.log(`[CRM Server] Vite dev middleware attached.`);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[CRM Server] Serving production static files from ${distPath}`);
  }

  app.listen(PORT, () => {
    console.log(`[CRM Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[CRM Server Error]', err);
  process.exit(1);
});
