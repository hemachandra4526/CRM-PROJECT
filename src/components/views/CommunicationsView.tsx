import React, { useState } from 'react';
import { Plus, Search, MessageSquare, Video, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { Interaction, InteractionType } from '../../types/crm.ts';

interface CommunicationsViewProps {
  interactions: Interaction[];
  onOpenLogInteraction: () => void;
  onSelectContact: (contactId: string) => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({
  interactions,
  onOpenLogInteraction,
  onSelectContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filtered = interactions.filter(item => {
    if (typeFilter !== 'All' && item.type !== typeFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.contactName.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getChannelIcon = (type: InteractionType) => {
    switch (type) {
      case 'Meeting':
        return <Video className="w-4 h-4 text-violet-600" />;
      case 'Call':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'Demo':
        return <Video className="w-4 h-4 text-emerald-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search communications, meeting summaries, contacts..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Channels</option>
            <option value="Meeting">Meeting</option>
            <option value="Call">Call</option>
            <option value="Demo">Demo</option>
            <option value="Email">Email</option>
            <option value="Proposal">Proposal</option>
            <option value="Note">Note</option>
          </select>

          <button
            onClick={onOpenLogInteraction}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Interaction</span>
          </button>
        </div>
      </div>

      {/* Communications Stream */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center border border-slate-200 rounded-lg text-xs text-slate-400">
            No interactions recorded matching the current filter.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-sm bg-slate-100 shrink-0">
                    {getChannelIcon(item.type)}
                  </div>
                  <div>
                    <span
                      onClick={() => onSelectContact(item.contactId)}
                      className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {item.contactName}
                    </span>
                    <span className="text-xs text-slate-500"> · {item.company}</span>
                  </div>
                </div>

                {/* Unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>Logged by {item.loggedBy}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-wrap">
                {item.summary}
              </p>

              {/* Outcomes & Follow-up indicators */}
              {(item.outcome || item.nextAction) && (
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.outcome && (
                    <div className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700">
                      <span className="font-semibold text-slate-900">Agreed Outcome: </span>
                      {item.outcome}
                    </div>
                  )}
                  {item.nextAction && (
                    <div className="p-2 bg-amber-50/70 rounded border border-amber-200 text-amber-900">
                      <span className="font-semibold text-amber-950">Next Action: </span>
                      {item.nextAction}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
