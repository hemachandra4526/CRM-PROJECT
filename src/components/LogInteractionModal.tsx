import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Contact, InteractionType, SentimentType } from '../types/crm.ts';

interface LogInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  defaultContactId?: string;
  onInteractionLogged: () => void;
}

export const LogInteractionModal: React.FC<LogInteractionModalProps> = ({
  isOpen,
  onClose,
  contacts,
  defaultContactId,
  onInteractionLogged
}) => {
  const [contactId, setContactId] = useState(defaultContactId || (contacts[0]?.id || ''));
  const [type, setType] = useState<InteractionType>('Meeting');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [outcome, setOutcome] = useState('');
  const [sentiment, setSentiment] = useState<SentimentType>('Positive');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [nextAction, setNextAction] = useState('');
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0] + 'T14:00'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactId || !title.trim() || !summary.trim()) {
      setError('Please select a contact and fill in the title and interaction summary.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          type,
          title: title.trim(),
          summary: summary.trim(),
          outcome: outcome.trim() || undefined,
          sentiment,
          loggedBy: 'Hemachandra',
          followUpRequired,
          nextAction: followUpRequired ? nextAction.trim() : undefined,
          scheduleDate: followUpRequired && scheduleDate ? new Date(scheduleDate).toISOString() : undefined
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to log communication.');
      }

      onInteractionLogged();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error occurred while saving interaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div>
            <span className="text-[11px] font-mono font-semibold uppercase text-violet-700">
              Stage 4 Engage · Communication Log
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              Record Interaction & Communication
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Stakeholder / Contact *
            </label>
            <select
              value={contactId}
              onChange={e => setContactId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
            >
              {contacts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company} ({c.ecosystemRole})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Channel / Type *
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as InteractionType)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Meeting">In-Person / Virtual Meeting</option>
                <option value="Call">Phone Call</option>
                <option value="Demo">Product / Platform Demo</option>
                <option value="Email">Email Communication</option>
                <option value="Proposal">Commercial Proposal Presentation</option>
                <option value="Note">Internal Strategy Note</option>
                <option value="WhatsApp">Messaging / WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Sentiment Outcome
              </label>
              <select
                value={sentiment}
                onChange={e => setSentiment(e.target.value as SentimentType)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Positive">Positive (Advancing)</option>
                <option value="Excited">Excited (High intent)</option>
                <option value="Neutral">Neutral (Informational)</option>
                <option value="Concern">Concern / Hesitation (Requires attention)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Discussion Subject / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Technical integration review with engineering leads"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Notes & Discussion Summary *
            </label>
            <textarea
              rows={3}
              required
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Key topics discussed, feedback received, stakeholder concerns, and team reactions..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Specific Agreement or Outcome
            </label>
            <input
              type="text"
              value={outcome}
              onChange={e => setOutcome(e.target.value)}
              placeholder="e.g. Client requested contract draft by Thursday"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Follow-up schedule check */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={followUpRequired}
                onChange={e => setFollowUpRequired(e.target.checked)}
                className="w-4 h-4 text-slate-900 rounded-xs border-slate-300 focus:ring-slate-900"
              />
              <span className="text-xs font-semibold text-slate-800">
                Schedule a follow-up action (Stage 5 Action Item)
              </span>
            </label>

            {followUpRequired && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Next Action Item
                  </label>
                  <input
                    type="text"
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value)}
                    placeholder="e.g. Send revised security addendum and schedule follow-up call"
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                    Target Execution Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Communication Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
