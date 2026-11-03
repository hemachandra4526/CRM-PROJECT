import React, { useState } from 'react';
import { Plus, DollarSign, Target, Calendar, CheckCircle2, TrendingUp, X } from 'lucide-react';
import { Deal, Contact, DealStage } from '../../types/crm.ts';

interface DealsViewProps {
  deals: Deal[];
  contacts: Contact[];
  onSelectContact: (contactId: string) => void;
  onRefreshDeals: () => void;
}

export const DealsView: React.FC<DealsViewProps> = ({
  deals,
  contacts,
  onSelectContact,
  onRefreshDeals
}) => {
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Deal form states
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('75000');
  const [stage, setStage] = useState<DealStage>('Proposal');
  const [probability, setProbability] = useState('70');
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [solutions, setSolutions] = useState('Enterprise Platform License, Partner Portal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDeals = deals.filter(d => stageFilter === 'All' || d.stage === stageFilter);
  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedValue = filteredDeals.reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contactId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          title: title.trim(),
          value: Number(value) || 0,
          stage,
          probability: Number(probability) || 50,
          expectedCloseDate,
          solutions: solutions.split(',').map(s => s.trim()).filter(Boolean),
          owner: 'Hemachandra'
        })
      });

      if (!res.ok) throw new Error('Failed to create deal');
      onRefreshDeals();
      setIsAddModalOpen(false);
      setTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStage = async (dealId: string, newStage: DealStage) => {
    try {
      await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: newStage,
          probability: newStage === 'Closed Won' ? 100 : newStage === 'Closed Lost' ? 0 : 75
        })
      });
      onRefreshDeals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Pipeline Value
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1">
            ${totalValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {filteredDeals.length} active opportunities
          </span>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Weighted Forecast Value
          </span>
          <div className="text-2xl font-bold font-mono text-blue-700 tabular-nums mt-1">
            ${Math.round(weightedValue).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Probability adjusted revenue projection
          </span>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Stage 6 Focus · Opportunity
          </span>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums mt-1">
            {deals.filter(d => d.stage === 'Proposal' || d.stage === 'Negotiation').length} Deals
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            In active commercial negotiation
          </span>
        </div>
      </div>

      {/* Control Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Filter by Stage:</span>
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Commercial Stages</option>
            <option value="Discovery">Discovery</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Contract Sent">Contract Sent</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Commercial Opportunity</span>
        </button>
      </div>

      {/* Deals Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-4">Opportunity & Organization</th>
              <th className="py-3 px-4">Commercial Stage</th>
              <th className="py-3 px-4 text-right">Projected Value</th>
              <th className="py-3 px-4 text-right">Probability</th>
              <th className="py-3 px-4">Target Close</th>
              <th className="py-3 px-4 text-right">Stage Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredDeals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No opportunities found.
                </td>
              </tr>
            ) : (
              filteredDeals.map(deal => (
                <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">
                      {deal.title}
                    </div>
                    <div
                      onClick={() => onSelectContact(deal.contactId)}
                      className="text-[11px] text-slate-500 hover:text-blue-600 cursor-pointer mt-0.5"
                    >
                      {deal.contactName} · {deal.company}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">
                      {deal.stage}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ${deal.value.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-slate-700 tabular-nums">
                    {deal.probability}%
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 tabular-nums">
                    {deal.expectedCloseDate}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {deal.stage !== 'Closed Won' && (
                        <button
                          onClick={() => handleUpdateStage(deal.id, 'Closed Won')}
                          className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-sm cursor-pointer transition-colors"
                        >
                          Mark Won
                        </button>
                      )}
                      {deal.stage !== 'Closed Lost' && deal.stage !== 'Closed Won' && (
                        <button
                          onClick={() => handleUpdateStage(deal.id, 'Closed Lost')}
                          className="px-2 py-1 text-[11px] font-medium text-slate-500 hover:text-rose-700 bg-slate-50 hover:bg-rose-50 border border-slate-200 rounded-sm cursor-pointer transition-colors"
                        >
                          Mark Lost
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Deal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">
                Create Commercial Opportunity (Stage 6)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Stakeholder / Account *
                </label>
                <select
                  value={contactId}
                  onChange={e => setContactId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Opportunity Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Enterprise License Expansion Q4"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Value ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Win Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={probability}
                    onChange={e => setProbability(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono tabular-nums border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Stage
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value as DealStage)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="Discovery">Discovery</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Contract Sent">Contract Sent</option>
                    <option value="Closed Won">Closed Won</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={expectedCloseDate}
                    onChange={e => setExpectedCloseDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Solutions & Scope
                </label>
                <input
                  type="text"
                  value={solutions}
                  onChange={e => setSolutions(e.target.value)}
                  placeholder="Platform seats, Custom SLA, API integrations"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
