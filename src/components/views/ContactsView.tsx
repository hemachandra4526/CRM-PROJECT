import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, ArrowRight, MessageSquare, Calendar } from 'lucide-react';
import { Contact, EcosystemRole, StageId, WORKFLOW_STAGES } from '../../types/crm.ts';

interface ContactsViewProps {
  contacts: Contact[];
  onSelectContact: (id: string) => void;
  onOpenCapture: () => void;
  onOpenLogInteraction: (contactId: string) => void;
  onOpenScheduleTask: (contactId: string) => void;
  initialStageFilter?: StageId | null;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  contacts,
  onSelectContact,
  onOpenCapture,
  onOpenLogInteraction,
  onOpenScheduleTask,
  initialStageFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>(initialStageFilter ? String(initialStageFilter) : 'All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredContacts = contacts.filter(c => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (stageFilter !== 'All' && c.stageId !== Number(stageFilter)) {
      return false;
    }

    if (roleFilter !== 'All' && c.ecosystemRole !== roleFilter) {
      return false;
    }

    if (statusFilter !== 'All' && c.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by stakeholder name, organization, email, or tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All 9 Stages</option>
            {Object.values(WORKFLOW_STAGES).map(st => (
              <option key={st.id} value={st.id}>
                Stage {st.id}: {st.name}
              </option>
            ))}
          </select>

          {/* Ecosystem Role Filter */}
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Ecosystem Roles</option>
            <option value="Enterprise Client">Enterprise Client</option>
            <option value="Ecosystem Partner">Ecosystem Partner</option>
            <option value="Early-Stage Founder">Early-Stage Founder</option>
            <option value="Strategic Investor">Strategic Investor</option>
            <option value="Executive Mentor">Executive Mentor</option>
            <option value="Technology Vendor">Technology Vendor</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Won">Won</option>
            <option value="Nurturing">Nurturing</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Primary CTA */}
          <button
            onClick={onOpenCapture}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Intake Lead</span>
          </button>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Stakeholder / Organization</th>
                <th className="py-3 px-4">Ecosystem Role</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4 text-right">Value ($)</th>
                <th className="py-3 px-4 text-right">Score</th>
                <th className="py-3 px-4">Last Engagement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No stakeholders match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => {
                  const stage = WORKFLOW_STAGES[contact.stageId];
                  const isOpportunity = contact.stageId === 6;

                  return (
                    <tr
                      key={contact.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onSelectContact(contact.id)}
                    >
                      {/* Name & Org */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center font-bold text-slate-700 text-[11px]">
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
                              contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {contact.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {contact.title} · {contact.company}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role (Unboxed metadata) */}
                      <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {contact.ecosystemRole}
                      </td>

                      {/* Stage */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                              isOpportunity
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-900 text-white'
                            }`}
                          >
                            {stage.id}
                          </span>
                          <div>
                            <div
                              className={`text-xs font-semibold ${
                                isOpportunity ? 'text-rose-600' : 'text-slate-900'
                              }`}
                            >
                              {stage.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {stage.tagline}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Value (Tabular right aligned) */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        ${contact.dealValue.toLocaleString()}
                      </td>

                      {/* Score */}
                      <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums whitespace-nowrap">
                        {contact.score}/100
                      </td>

                      {/* Last contacted */}
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] tabular-nums whitespace-nowrap">
                        {new Date(contact.lastContactedAt).toLocaleDateString()}
                      </td>

                      {/* Row Actions */}
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onOpenLogInteraction(contact.id)}
                            title="Log Communication"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenScheduleTask(contact.id)}
                            title="Schedule Follow-up"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectContact(contact.id)}
                            title="View Full Profile"
                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50/75 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredContacts.length} of {contacts.length} total stakeholders</span>
          <span className="font-mono tabular-nums">
            Total Displayed Value: ${filteredContacts.reduce((s, c) => s + c.dealValue, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
