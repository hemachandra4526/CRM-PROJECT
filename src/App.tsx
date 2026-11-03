import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar.tsx';
import { WorkflowLifecycleBanner } from './components/WorkflowLifecycleBanner.tsx';
import { OverviewView } from './components/views/OverviewView.tsx';
import { PipelineView } from './components/views/PipelineView.tsx';
import { ContactsView } from './components/views/ContactsView.tsx';
import { CommunicationsView } from './components/views/CommunicationsView.tsx';
import { DealsView } from './components/views/DealsView.tsx';
import { TasksView } from './components/views/TasksView.tsx';
import { CaptureLeadModal } from './components/CaptureLeadModal.tsx';
import { LogInteractionModal } from './components/LogInteractionModal.tsx';
import { NewTaskModal } from './components/NewTaskModal.tsx';
import { ContactDetailDrawer } from './components/ContactDetailDrawer.tsx';
import {
  Contact,
  Interaction,
  Deal,
  TaskItem,
  CRMMetrics,
  StageId
} from './types/crm.ts';
import {
  fetchContacts,
  fetchMetrics,
  fetchInteractions,
  fetchDeals,
  fetchTasks,
  advanceContactStage,
  toggleTask,
  deleteTask
} from './services/api.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [metrics, setMetrics] = useState<CRMMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & modal controls
  const [selectedStageFilter, setSelectedStageFilter] = useState<StageId | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [isLogInteractionModalOpen, setIsLogInteractionModalOpen] = useState(false);
  const [logInteractionTargetId, setLogInteractionTargetId] = useState<string | undefined>(undefined);
  const [isScheduleTaskModalOpen, setIsScheduleTaskModalOpen] = useState(false);
  const [scheduleTaskTargetId, setScheduleTaskTargetId] = useState<string | undefined>(undefined);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [cData, mData, iData, dData, tData] = await Promise.all([
        fetchContacts(),
        fetchMetrics(),
        fetchInteractions(),
        fetchDeals(),
        fetchTasks()
      ]);

      setContacts(cData);
      setMetrics(mData);
      setInteractions(iData);
      setDeals(dData);
      setTasks(tData);
    } catch (err: any) {
      console.error('Failed to load CRM data:', err);
      setError('Unable to connect to CRM backend service. Retrying...');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Stage counts for the workflow diagram
  const stageCounts = React.useMemo(() => {
    const counts: Record<StageId, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0
    };
    contacts.forEach(c => {
      if (c.stageId >= 1 && c.stageId <= 9) {
        counts[c.stageId] = (counts[c.stageId] || 0) + 1;
      }
    });
    return counts;
  }, [contacts]);

  const handleStageSelectFromBanner = (stageId: StageId | null) => {
    setSelectedStageFilter(stageId);
    if (stageId !== null && currentTab !== 'contacts' && currentTab !== 'pipeline') {
      setCurrentTab('contacts');
    }
  };

  const handleAdvanceStage = async (contactId: string, nextStage: StageId) => {
    try {
      await advanceContactStage(contactId, nextStage);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask(taskId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenLogForContact = (contactId: string) => {
    setLogInteractionTargetId(contactId);
    setIsLogInteractionModalOpen(true);
  };

  const handleOpenScheduleForContact = (contactId: string) => {
    setScheduleTaskTargetId(contactId);
    setIsScheduleTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
        }}
        onOpenCapture={() => setIsCaptureModalOpen(true)}
      />

      {/* Main Content Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Banner with 9-stage lifecycle workflow */}
        <WorkflowLifecycleBanner
          selectedStageFilter={selectedStageFilter}
          onSelectStageFilter={handleStageSelectFromBanner}
          stageCounts={stageCounts}
        />

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => loadData()}
              className="font-semibold underline hover:no-underline cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Tab Viewport Routing */}
        {loading && contacts.length === 0 ? (
          <div className="py-24 text-center">
            <div className="inline-block w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-3"></div>
            <div className="text-xs font-mono text-slate-500">
              Synchronizing CRM lifecycle data...
            </div>
          </div>
        ) : (
          <div>
            {currentTab === 'overview' && (
              <OverviewView
                metrics={metrics}
                contacts={contacts}
                interactions={interactions}
                tasks={tasks}
                onSelectContact={id => setSelectedContactId(id)}
                onSelectStage={sId => {
                  setSelectedStageFilter(sId);
                  setCurrentTab('contacts');
                }}
                onNavigateToTab={tab => setCurrentTab(tab)}
                onOpenCapture={() => setIsCaptureModalOpen(true)}
              />
            )}

            {currentTab === 'pipeline' && (
              <PipelineView
                contacts={contacts}
                onSelectContact={id => setSelectedContactId(id)}
                onAdvanceStage={handleAdvanceStage}
                onOpenCapture={() => setIsCaptureModalOpen(true)}
              />
            )}

            {currentTab === 'contacts' && (
              <ContactsView
                contacts={contacts}
                onSelectContact={id => setSelectedContactId(id)}
                onOpenCapture={() => setIsCaptureModalOpen(true)}
                onOpenLogInteraction={handleOpenLogForContact}
                onOpenScheduleTask={handleOpenScheduleForContact}
                initialStageFilter={selectedStageFilter}
              />
            )}

            {currentTab === 'communications' && (
              <CommunicationsView
                interactions={interactions}
                onOpenLogInteraction={() => {
                  setLogInteractionTargetId(undefined);
                  setIsLogInteractionModalOpen(true);
                }}
                onSelectContact={id => setSelectedContactId(id)}
              />
            )}

            {currentTab === 'deals' && (
              <DealsView
                deals={deals}
                contacts={contacts}
                onSelectContact={id => setSelectedContactId(id)}
                onRefreshDeals={loadData}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onOpenScheduleTask={() => {
                  setScheduleTaskTargetId(undefined);
                  setIsScheduleTaskModalOpen(true);
                }}
                onSelectContact={id => setSelectedContactId(id)}
              />
            )}
          </div>
        )}
      </main>

      {/* Slide-over Contact Profile Drawer */}
      <ContactDetailDrawer
        contactId={selectedContactId}
        onClose={() => setSelectedContactId(null)}
        onRefreshList={loadData}
        onOpenLogInteraction={handleOpenLogForContact}
        onOpenScheduleTask={handleOpenScheduleForContact}
      />

      {/* Capture Lead Modal */}
      <CaptureLeadModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onLeadCaptured={newLead => {
          loadData();
          setSelectedContactId(newLead.id);
        }}
      />

      {/* Log Interaction Modal */}
      <LogInteractionModal
        isOpen={isLogInteractionModalOpen}
        onClose={() => {
          setIsLogInteractionModalOpen(false);
          setLogInteractionTargetId(undefined);
        }}
        contacts={contacts}
        defaultContactId={logInteractionTargetId}
        onInteractionLogged={loadData}
      />

      {/* Schedule Task Modal */}
      <NewTaskModal
        isOpen={isScheduleTaskModalOpen}
        onClose={() => {
          setIsScheduleTaskModalOpen(false);
          setScheduleTaskTargetId(undefined);
        }}
        contacts={contacts}
        defaultContactId={scheduleTaskTargetId}
        onTaskCreated={loadData}
      />
    </div>
  );
}
