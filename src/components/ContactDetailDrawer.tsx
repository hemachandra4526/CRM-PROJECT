import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  Contact,
  Interaction,
  Deal,
  TaskItem,
  StageId,
  WORKFLOW_STAGES
} from '../types/crm.ts';
import {
  fetchContactById,
  advanceContactStage,
  toggleTask,
  deleteContact
} from '../services/api.ts';

interface ContactDetailDrawerProps {
  contactId: string | null;
  onClose: () => void;
  onRefreshList: () => void;
  onOpenLogInteraction: (contactId: string) => void;
  onOpenScheduleTask: (contactId: string) => void;
}

export const ContactDetailDrawer: React.FC<ContactDetailDrawerProps> = ({
  contactId,
  onClose,
  onRefreshList,
  onOpenLogInteraction,
  onOpenScheduleTask
}) => {
  const [data, setData] = useState<{
    contact: Contact;
    interactions: Interaction[];
    deals: Deal[];
    tasks: TaskItem[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'deals' | 'tasks' | 'notes'>('timeline');
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (!contactId) {
      setData(null);
      return;
    }

    setLoading(true);
    fetchContactById(contactId)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [contactId]);

  if (!contactId) return null;

  const handleAdvanceStage = async (targetStage: StageId) => {
    if (!data) return;
    setAdvancing(true);
    try {
      await advanceContactStage(data.contact.id, targetStage);
      const updated = await fetchContactById(data.contact.id);
      setData(updated);
      onRefreshList();
    } catch (err) {
      console.error(err);
    } finally {
      setAdvancing(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
      if (data) {
        const updated = await fetchContactById(data.contact.id);
        setData(updated);
        onRefreshList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!data) return;
    if (confirm(`Are you sure you want to remove ${data.contact.name} from the CRM?`)) {
      try {
        await deleteContact(data.contact.id);
        onRefreshList();
        onClose();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const contact = data?.contact;
  const currentStage = contact ? WORKFLOW_STAGES[contact.stageId] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase text-slate-500">
              Stage 3 · Contact Profile
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              title="Delete Contact"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading || !contact ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-xs text-slate-400 font-mono">Loading profile data...</div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Contact Hero Info */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-start gap-4">
                {/* Avatar with fallback container per Zero-Broken-Image Policy */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
                  {contact.avatarUrl ? (
                    <img
                      src={contact.avatarUrl}
                      alt={contact.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-base font-bold text-slate-700">
                      {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-slate-900 truncate">
                    {contact.name}
                  </h2>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {contact.title} · {contact.company}
                  </p>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
                    <span className="font-medium text-slate-800">{contact.ecosystemRole}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Score: {contact.score}/100</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-900">
                      ${contact.dealValue.toLocaleString()} deal
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Source: {contact.source}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-700 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:underline truncate">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.phone || 'No phone recorded'}</span>
                </div>
              </div>
            </div>

            {/* 9-Stage Lifecycle Progression Ribbon */}
            <div className="p-6 bg-slate-50/70 border-b border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-semibold uppercase text-slate-600">
                  Current Lifecycle Progression
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  Stage {contact.stageId} of 9: {currentStage?.name}
                </span>
              </div>

              {/* Stage buttons */}
              <div className="grid grid-cols-9 gap-1 my-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                  const sId = num as StageId;
                  const st = WORKFLOW_STAGES[sId];
                  const isCurrent = contact.stageId === sId;
                  const isPast = contact.stageId > sId;

                  return (
                    <button
                      key={sId}
                      onClick={() => handleAdvanceStage(sId)}
                      disabled={advancing}
                      title={`${st.id}. ${st.name} (${st.tagline})`}
                      className={`h-7 flex items-center justify-center text-xs font-mono font-bold rounded-xs transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-slate-900 text-white shadow-xs'
                          : isPast
                          ? 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                          : 'bg-white border border-slate-200 text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{currentStage?.tagline} — {currentStage?.description}</span>
                {contact.stageId < 9 && (
                  <button
                    onClick={() => handleAdvanceStage((contact.stageId + 1) as StageId)}
                    disabled={advancing}
                    className="inline-flex items-center gap-1 font-semibold text-slate-900 hover:text-slate-700 cursor-pointer ml-2 shrink-0"
                  >
                    <span>Advance to Stage {contact.stageId + 1}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 px-6 py-3 bg-white border-b border-slate-200">
              <button
                onClick={() => onOpenLogInteraction(contact.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Communication</span>
              </button>
              <button
                onClick={() => onOpenScheduleTask(contact.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Follow-Up</span>
              </button>
            </div>

            {/* Content Tabs */}
            <div className="px-6 border-b border-slate-200 bg-white">
              <div className="flex items-center gap-6 text-xs font-medium text-slate-600">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`py-3 relative cursor-pointer ${
                    activeTab === 'timeline' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Communication History ({data.interactions.length})
                  {activeTab === 'timeline' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`py-3 relative cursor-pointer ${
                    activeTab === 'deals' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Deals ({data.deals.length})
                  {activeTab === 'deals' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`py-3 relative cursor-pointer ${
                    activeTab === 'tasks' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Follow-ups ({data.tasks.length})
                  {activeTab === 'tasks' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`py-3 relative cursor-pointer ${
                    activeTab === 'notes' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
                  }`}
                >
                  Notes & Context
                  {activeTab === 'notes' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Viewport */}
            <div className="p-6">
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  {data.interactions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No interactions recorded yet. Click "Log Communication" to capture notes.
                    </div>
                  ) : (
                    data.interactions.map(item => (
                      <div
                        key={item.id}
                        className="p-3.5 border border-slate-200 rounded-md bg-white hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {item.type}
                            </span>
                            <span aria-hidden="true" className="text-slate-300">·</span>
                            <span className="text-slate-500">{item.loggedBy}</span>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px] tabular-nums">
                            {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.summary}
                        </p>
                        {item.outcome && (
                          <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/60 p-2 rounded-xs border border-emerald-100">
                            <span className="font-medium">Outcome:</span> {item.outcome}
                          </div>
                        )}
                        {item.nextAction && (
                          <div className="mt-1 text-xs text-amber-800 bg-amber-50/60 p-2 rounded-xs border border-amber-100">
                            <span className="font-medium">Next Action:</span> {item.nextAction}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'deals' && (
                <div className="space-y-3">
                  {data.deals.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No commercial opportunities associated with this contact.
                    </div>
                  ) : (
                    data.deals.map(deal => (
                      <div
                        key={deal.id}
                        className="p-4 border border-slate-200 rounded-md bg-white flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-500 uppercase">
                            {deal.stage} · {deal.probability}% Probability
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                            {deal.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <span>Close: {deal.expectedCloseDate}</span>
                            <span aria-hidden="true">·</span>
                            <span>{deal.solutions.join(', ')}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-mono font-bold text-slate-900 tabular-nums">
                            ${deal.value.toLocaleString()}
                          </div>
                          <span className="text-[11px] text-slate-400">Projected ARR</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="space-y-2">
                  {data.tasks.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No pending follow-ups scheduled for this contact.
                    </div>
                  ) : (
                    data.tasks.map(task => (
                      <div
                        key={task.id}
                        className={`p-3 border rounded-md flex items-start gap-3 transition-colors ${
                          task.completed
                            ? 'bg-slate-50 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className="mt-0.5 text-slate-400 hover:text-slate-900 cursor-pointer"
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              task.completed ? 'text-emerald-600 fill-emerald-50' : 'text-slate-300'
                            }`}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs font-semibold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono tabular-nums">Due: {task.dueDate} {task.dueTime}</span>
                            <span aria-hidden="true">·</span>
                            <span>{task.priority} Priority</span>
                          </div>
                          {task.notes && (
                            <p className="text-[11px] text-slate-500 mt-1">{task.notes}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-md">
                    <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">
                      Ecosystem Notes & Strategy
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {contact.notes || 'No extended notes logged for this contact.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-700 uppercase mb-2">
                      Tags & Classification
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {contact.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
