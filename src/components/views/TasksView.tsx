import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, Calendar, AlertCircle, Trash2, Check } from 'lucide-react';
import { TaskItem, TaskPriority } from '../../types/crm.ts';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenScheduleTask: () => void;
  onSelectContact: (contactId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenScheduleTask,
  onSelectContact
}) => {
  const [filterStatus, setFilterStatus] = useState<'pending' | 'completed' | 'all'>('pending');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'pending' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    return true;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-lg shadow-xs">
        <div className="flex items-center gap-2">
          {/* Segmented controls button */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({tasks.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'completed'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({tasks.filter(t => t.completed).length})
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({tasks.length})
            </button>
          </div>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <button
          onClick={onOpenScheduleTask}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Action</span>
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No scheduled follow-up actions matching your filter.
          </div>
        ) : (
          filteredTasks.map(task => {
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const isToday = !task.completed && task.dueDate === todayStr;

            return (
              <div
                key={task.id}
                className={`p-4 flex items-start gap-3.5 transition-colors ${
                  task.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Toggle Completion */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-0.5 w-5 h-5 rounded-sm border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    task.completed
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'border-slate-300 hover:border-slate-900 bg-white'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span
                      className={`text-sm font-semibold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Due badge / status */}
                    <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                      <span
                        className={`tabular-nums ${
                          isOverdue
                            ? 'text-rose-600 font-bold'
                            : isToday
                            ? 'text-amber-600 font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {isOverdue && 'Overdue · '}
                        {isToday && 'Today · '}
                        Due {task.dueDate} {task.dueTime}
                      </span>
                    </div>
                  </div>

                  {/* Associated stakeholder & unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                    {task.contactName && task.contactId ? (
                      <span
                        onClick={() => onSelectContact(task.contactId!)}
                        className="font-medium text-slate-800 hover:text-blue-600 cursor-pointer"
                      >
                        {task.contactName} ({task.company})
                      </span>
                    ) : (
                      <span>General Pipeline Task</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="font-medium">{task.type}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={`font-semibold ${
                        task.priority === 'High'
                          ? 'text-rose-600'
                          : task.priority === 'Medium'
                          ? 'text-amber-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Assigned to {task.assignedTo}</span>
                  </div>

                  {task.notes && (
                    <p className="text-xs text-slate-600 mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                      {task.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-1">
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    title="Delete task"
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
