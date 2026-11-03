import React from 'react';
import { ChevronRight, DollarSign, Clock, UserCheck } from 'lucide-react';
import { Contact, StageId, WORKFLOW_STAGES } from '../../types/crm.ts';

interface PipelineViewProps {
  contacts: Contact[];
  onSelectContact: (id: string) => void;
  onAdvanceStage: (contactId: string, nextStage: StageId) => void;
  onOpenCapture: () => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  contacts,
  onSelectContact,
  onAdvanceStage,
  onOpenCapture
}) => {
  const stageIds: StageId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Lifecycle Pipeline Kanban
          </h2>
          <p className="text-xs text-slate-500">
            Monitor and advance contacts through the complete 9-stage lead-to-customer lifecycle
          </p>
        </div>
        <button
          onClick={onOpenCapture}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Capture New Intake</span>
        </button>
      </div>

      {/* Horizontal Multi-Column Pipeline */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="flex gap-3 min-w-[1900px]">
          {stageIds.map(stageId => {
            const stage = WORKFLOW_STAGES[stageId];
            const stageContacts = contacts.filter(c => c.stageId === stageId);
            const stageValue = stageContacts.reduce((sum, c) => sum + (c.dealValue || 0), 0);
            const isOpportunity = stageId === 6;

            return (
              <div
                key={stageId}
                className="w-56 shrink-0 flex flex-col bg-slate-100/70 border border-slate-200 rounded-lg p-2.5 max-h-[750px]"
              >
                {/* Column Header */}
                <div className="pb-2.5 mb-2.5 border-b border-slate-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-mono font-bold px-1.5 py-0.5 rounded-xs text-[10px] ${
                        isOpportunity ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'
                      }`}
                    >
                      {stage.id}
                    </span>
                    <span className="font-mono text-slate-500 font-semibold tabular-nums text-[11px]">
                      {stageContacts.length}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isOpportunity ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {stage.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {stage.tagline}
                  </div>
                  <div className="text-[11px] font-mono font-semibold text-slate-700 tabular-nums mt-1">
                    ${(stageValue / 1000).toFixed(0)}k pipeline
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
                  {stageContacts.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-slate-300 rounded-md text-[11px] text-slate-400">
                      No contacts in {stage.name}
                    </div>
                  ) : (
                    stageContacts.map(contact => (
                      <div
                        key={contact.id}
                        className="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-md shadow-2xs hover:shadow-xs transition-all group"
                      >
                        {/* Title and Organization */}
                        <div
                          onClick={() => onSelectContact(contact.id)}
                          className="cursor-pointer"
                        >
                          <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {contact.name}
                          </div>
                          <div className="text-[11px] text-slate-600 truncate mt-0.5">
                            {contact.company}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {contact.ecosystemRole}
                          </div>
                        </div>

                        {/* Value & Score */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px]">
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            ${contact.dealValue.toLocaleString()}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                            Score {contact.score}
                          </span>
                        </div>

                        {/* Advance Action */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 text-[11px]">
                          <button
                            onClick={() => onSelectContact(contact.id)}
                            className="text-slate-500 hover:text-slate-800 text-[10px] font-medium cursor-pointer"
                          >
                            Details
                          </button>

                          {stageId < 9 && (
                            <button
                              onClick={() => onAdvanceStage(contact.id, (stageId + 1) as StageId)}
                              className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-slate-900 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-sm transition-colors cursor-pointer"
                              title={`Advance to Stage ${stageId + 1}`}
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
