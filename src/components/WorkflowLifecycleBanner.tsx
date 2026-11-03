import React from 'react';
import { ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import { StageId, WORKFLOW_STAGES } from '../types/crm.ts';

interface WorkflowLifecycleBannerProps {
  selectedStageFilter: StageId | null;
  onSelectStageFilter: (stageId: StageId | null) => void;
  stageCounts?: Record<StageId, number>;
}

export const WorkflowLifecycleBanner: React.FC<WorkflowLifecycleBannerProps> = ({
  selectedStageFilter,
  onSelectStageFilter,
  stageCounts
}) => {
  const rowOneStages: StageId[] = [1, 2, 3, 4, 5];
  const rowTwoStages: StageId[] = [6, 7, 8, 9]; // Flow from 5 down to 6, then 7, 8, 9

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs mb-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-mono font-semibold text-rose-600 uppercase tracking-widest">
            07 · CRM SYSTEM WORKFLOW
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            Complete Lead-to-Customer Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            A unified business platform bringing lead management, customer information, communication history, 
            sales opportunities, and follow-up schedules into one centralized workspace.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectedStageFilter && (
            <button
              onClick={() => onSelectStageFilter(null)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded-sm bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Clear Filter
            </button>
          )}
          <span className="text-xs text-slate-400 font-mono">
            {selectedStageFilter ? `Filtered: Stage ${selectedStageFilter}` : 'Click any step to filter'}
          </span>
        </div>
      </div>

      {/* Interactive 9-Step Stage Diagram */}
      <div className="py-2">
        {/* Row 1: Steps 1 to 5 */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 items-center">
          {rowOneStages.map((stageId, idx) => {
            const stage = WORKFLOW_STAGES[stageId];
            const isSelected = selectedStageFilter === stageId;
            const count = stageCounts ? stageCounts[stageId] || 0 : 0;

            return (
              <div key={stageId} className="flex items-center">
                <button
                  onClick={() => onSelectStageFilter(isSelected ? null : stageId)}
                  className={`flex-1 text-center p-2.5 rounded-md transition-all cursor-pointer group border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                        isSelected
                          ? 'bg-white text-slate-900'
                          : 'bg-slate-900 text-white group-hover:scale-105'
                      }`}
                    >
                      {stage.id}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {stage.name}
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {stage.tagline}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tabular-nums text-slate-400">
                    {count} {count === 1 ? 'contact' : 'contacts'}
                  </div>
                </button>

                {idx < rowOneStages.length - 1 && (
                  <div className="hidden sm:flex px-1 text-rose-500 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Transition indicator from 5 down to 6 */}
        <div className="flex justify-end pr-8 sm:pr-12 my-2 text-rose-500">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium">
            <span>Progress deal</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Row 2: Steps 6 to 9 */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 items-center">
          {rowTwoStages.map((stageId, idx) => {
            const stage = WORKFLOW_STAGES[stageId];
            const isSelected = selectedStageFilter === stageId;
            const count = stageCounts ? stageCounts[stageId] || 0 : 0;
            const isOpportunity = stageId === 6;

            return (
              <div key={stageId} className="flex items-center">
                <button
                  onClick={() => onSelectStageFilter(isSelected ? null : stageId)}
                  className={`flex-1 text-center p-2.5 rounded-md transition-all cursor-pointer group border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : isOpportunity
                      ? 'bg-rose-50/50 hover:bg-rose-50 text-slate-800 border-rose-200'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                        isSelected
                          ? 'bg-white text-slate-900'
                          : isOpportunity
                          ? 'bg-rose-600 text-white group-hover:scale-105'
                          : 'bg-slate-900 text-white group-hover:scale-105'
                      }`}
                    >
                      {stage.id}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'text-white'
                        : isOpportunity
                        ? 'text-rose-600'
                        : 'text-slate-900'
                    }`}
                  >
                    {stage.name}
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {stage.tagline}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tabular-nums text-slate-400">
                    {count} {count === 1 ? 'contact' : 'contacts'}
                  </div>
                </button>

                {idx < rowTwoStages.length - 1 && (
                  <div className="hidden sm:flex px-1 text-rose-500 shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Centralized Action Banner (Direct from Diagram) */}
      <div className="mt-4 bg-[#0a192f] text-white py-2.5 px-4 rounded-md text-center">
        <p className="text-xs sm:text-xs font-semibold uppercase tracking-wider">
          Complete Lead-to-Customer Lifecycle — Centralized, Trackable and Action-Oriented
        </p>
      </div>
    </div>
  );
};
