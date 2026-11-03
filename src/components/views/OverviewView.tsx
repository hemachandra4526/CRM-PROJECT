import React from 'react';
import {
  Users,
  Target,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  CRMMetrics,
  Contact,
  Interaction,
  TaskItem,
  WORKFLOW_STAGES,
  StageId
} from '../../types/crm.ts';

interface OverviewViewProps {
  metrics: CRMMetrics | null;
  contacts: Contact[];
  interactions: Interaction[];
  tasks: TaskItem[];
  onSelectContact: (id: string) => void;
  onSelectStage: (stageId: StageId) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenCapture: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
  contacts,
  interactions,
  tasks,
  onSelectContact,
  onSelectStage,
  onNavigateToTab,
  onOpenCapture
}) => {
  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 5);
  const recentInteractions = interactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Headline Strip: 4 KPI Tiles with Tabular Numerals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Contacts */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Stakeholders
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
            {metrics ? metrics.totalContacts : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 font-mono tabular-nums">
              {metrics ? metrics.activeLeads : 0} active
            </span>
            <span>across ecosystem</span>
          </div>
        </div>

        {/* KPI 2: Pipeline Value */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pipeline Value
            </span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2">
            ${metrics ? (metrics.totalPipelineValue / 1000).toFixed(0) : '—'}k
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="font-mono tabular-nums font-semibold text-slate-900">
              ${metrics ? metrics.totalPipelineValue.toLocaleString() : 0}
            </span>{' '}
            total active pipeline
          </div>
        </div>

        {/* KPI 3: Closed Won */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Converted Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2 text-emerald-700">
            ${metrics ? (metrics.closedWonValue / 1000).toFixed(0) : '—'}k
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 font-mono tabular-nums">
              {metrics ? metrics.winRate : 75}%
            </span>
            <span>opportunity win rate</span>
          </div>
        </div>

        {/* KPI 4: Pending Follow-ups */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Follow-Up Actions
            </span>
            <CalendarCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-2 text-amber-700">
            {metrics ? metrics.pendingFollowUpsCount : '—'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Scheduled on sales calendar
          </div>
        </div>
      </div>

      {/* 9-Stage Funnel Breakdown */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              9-Stage Workflow Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live funnel velocity from Stage 1 (Capture) through Stage 9 (Retain)
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('pipeline')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 cursor-pointer"
          >
            <span>Open Pipeline Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {metrics?.stageDistribution.map(st => {
            const isOpportunity = st.stageId === 6;
            return (
              <button
                key={st.stageId}
                onClick={() => onSelectStage(st.stageId)}
                className={`p-2.5 rounded-md border text-left transition-all cursor-pointer group ${
                  isOpportunity
                    ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Stage {st.stageId}</span>
                  <span className="font-bold text-slate-900">{st.count}</span>
                </div>
                <div
                  className={`text-xs font-bold truncate ${
                    isOpportunity ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {st.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {st.tagline}
                </div>
                <div className="text-[11px] font-mono font-semibold text-slate-700 tabular-nums mt-1.5 pt-1.5 border-t border-slate-100">
                  ${(st.totalValue / 1000).toFixed(0)}k
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Split: Recent Communications (Left) & Upcoming Follow-ups (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Engagement Stream */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Stakeholder Interactions
              </h3>
              <p className="text-xs text-slate-500">
                Logged across calls, meetings, demos, and ecosystem reviews
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('communications')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {recentInteractions.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectContact(item.contactId)}
                className="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.contactName} ({item.company})
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-800">
                  {item.type} · {item.title}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {item.summary}
                </p>
                {item.outcome && (
                  <div className="mt-1.5 text-[11px] text-emerald-800 font-medium">
                    Outcome: {item.outcome}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Follow-up Scheduling Queue */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Upcoming Sales & Ecosystem Follow-Ups
              </h3>
              <p className="text-xs text-slate-500">
                Stage 5 scheduled action items and stakeholder commitments
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('tasks')}
              className="text-xs font-semibold text-slate-900 hover:text-slate-700 cursor-pointer"
            >
              Calendar & Tasks
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {pendingTasks.map(task => (
              <div
                key={task.id}
                className="p-3 border border-slate-200 rounded-md bg-white hover:border-slate-300 transition-colors flex items-start justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    {task.title}
                  </div>
                  {task.contactName && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {task.contactName} · {task.company}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Due: {task.dueDate} {task.dueTime}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700">{task.priority} Priority</span>
                  </div>
                </div>

                {task.contactId && (
                  <button
                    onClick={() => onSelectContact(task.contactId!)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ecosystem Role Distribution Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">
          Ecosystem Network Composition
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Practical exposure to stakeholder management in ecosystem-building activities
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics?.ecosystemDistribution.map(eco => (
            <div
              key={eco.role}
              className="p-3 rounded-md border border-slate-200 bg-slate-50/50"
            >
              <div className="text-[11px] font-semibold text-slate-600 truncate">
                {eco.role}
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums mt-1">
                {eco.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
