import {
  Contact,
  Interaction,
  Deal,
  TaskItem,
  CRMMetrics,
  StageId
} from '../types/crm.ts';

export async function fetchMetrics(): Promise<CRMMetrics> {
  const res = await fetch('/api/metrics');
  if (!res.ok) throw new Error('Failed to fetch CRM metrics');
  return res.json();
}

export async function fetchContacts(params?: {
  search?: string;
  stage?: number;
  status?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<Contact[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append('search', params.search);
  if (params?.stage) query.append('stage', String(params.stage));
  if (params?.status && params.status !== 'All') query.append('status', params.status);
  if (params?.role && params.role !== 'All') query.append('role', params.role);
  if (params?.sortBy) query.append('sortBy', params.sortBy);
  if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

  const res = await fetch(`/api/contacts?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
}

export async function fetchContactById(id: string): Promise<{
  contact: Contact;
  interactions: Interaction[];
  deals: Deal[];
  tasks: TaskItem[];
}> {
  const res = await fetch(`/api/contacts/${id}`);
  if (!res.ok) throw new Error('Failed to fetch contact profile');
  return res.json();
}

export async function createContact(contactData: Partial<Contact>): Promise<Contact> {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to capture contact');
  }
  return res.json();
}

export async function updateContact(id: string, contactData: Partial<Contact>): Promise<Contact> {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  if (!res.ok) throw new Error('Failed to update contact');
  return res.json();
}

export async function advanceContactStage(id: string, targetStage: StageId, reason?: string): Promise<{ contact: Contact; interaction: Interaction }> {
  const res = await fetch(`/api/contacts/${id}/advance-stage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetStage, reason })
  });
  if (!res.ok) throw new Error('Failed to advance workflow stage');
  return res.json();
}

export async function deleteContact(id: string): Promise<void> {
  const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete contact');
}

export async function fetchInteractions(params?: {
  contactId?: string;
  type?: string;
  search?: string;
}): Promise<Interaction[]> {
  const query = new URLSearchParams();
  if (params?.contactId) query.append('contactId', params.contactId);
  if (params?.type && params.type !== 'All') query.append('type', params.type);
  if (params?.search) query.append('search', params.search);

  const res = await fetch(`/api/interactions?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch interactions');
  return res.json();
}

export async function createInteraction(data: {
  contactId: string;
  type: string;
  title: string;
  summary: string;
  outcome?: string;
  sentiment?: string;
  loggedBy?: string;
  followUpRequired?: boolean;
  nextAction?: string;
  scheduleDate?: string;
}): Promise<{ interaction: Interaction; task?: TaskItem }> {
  const res = await fetch('/api/interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to log interaction');
  }
  return res.json();
}

export async function fetchDeals(stage?: string): Promise<Deal[]> {
  const url = stage && stage !== 'All' ? `/api/deals?stage=${encodeURIComponent(stage)}` : '/api/deals';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch deals');
  return res.json();
}

export async function createDeal(data: Partial<Deal>): Promise<Deal> {
  const res = await fetch('/api/deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create deal');
  return res.json();
}

export async function updateDeal(id: string, data: Partial<Deal>): Promise<Deal> {
  const res = await fetch(`/api/deals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update deal');
  return res.json();
}

export async function fetchTasks(params?: {
  completed?: boolean;
  priority?: string;
  contactId?: string;
}): Promise<TaskItem[]> {
  const query = new URLSearchParams();
  if (params?.completed !== undefined) query.append('completed', String(params.completed));
  if (params?.priority && params.priority !== 'All') query.append('priority', params.priority);
  if (params?.contactId) query.append('contactId', params.contactId);

  const res = await fetch(`/api/tasks?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(data: Partial<TaskItem>): Promise<TaskItem> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create task schedule');
  return res.json();
}

export async function toggleTask(id: string): Promise<TaskItem> {
  const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PATCH' });
  if (!res.ok) throw new Error('Failed to toggle task completion');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}
