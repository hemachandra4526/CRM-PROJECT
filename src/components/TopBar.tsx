import React from 'react';
import { Plus } from 'lucide-react';

interface TopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCapture: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCapture
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'pipeline', label: 'Lifecycle Pipeline' },
    { id: 'contacts', label: 'Contacts Directory' },
    { id: 'communications', label: 'Communications' },
    { id: 'deals', label: 'Opportunities' },
    { id: 'tasks', label: 'Scheduling & Tasks' }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark in display face */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('overview')}
              className="text-left group cursor-pointer focus-visible:outline-none"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-900"></span>
                <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors whitespace-nowrap">
                  CRM · Customer Relationship Management
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: 4–6 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 text-sm ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCapture}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Capture Lead</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary nav scroll */}
        <div className="lg:hidden flex items-center gap-3 py-2 overflow-x-auto border-t border-slate-100 no-scrollbar">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`text-xs px-2.5 py-1 rounded-sm whitespace-nowrap transition-colors cursor-pointer ${
                currentTab === item.id
                  ? 'bg-slate-900 text-white font-medium'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
