import React from 'react';
import {
  Clock,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  User,
  Package,
  AlertTriangle,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Task, TaskStatus, TaskFilterState } from '../types.js';

interface TaskBoardProps {
  tasks: Task[];
  filters: TaskFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  filters,
  setFilters,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Extract unique owners for filter dropdown
  const uniqueOwners = Array.from(new Set(tasks.map((t) => t.owner))).filter(Boolean);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchOwner = task.owner.toLowerCase().includes(query);
      const matchDeliverable = task.deliverable.toLowerCase().includes(query);
      const matchBlocked = (task.blockedReason || '').toLowerCase().includes(query);
      if (!matchTitle && !matchOwner && !matchDeliverable && !matchBlocked) {
        return false;
      }
    }

    // Status filter
    if (filters.statusFilter !== 'All' && task.status !== filters.statusFilter) {
      return false;
    }

    // Owner filter
    if (filters.ownerFilter && task.owner !== filters.ownerFilter) {
      return false;
    }

    // Priority filter
    if (filters.priorityFilter !== 'All' && task.priority !== filters.priorityFilter) {
      return false;
    }

    // Overdue filter
    if (filters.overdueOnly) {
      const isOverdue = task.status !== 'Done' && task.deadline < todayStr;
      if (!isOverdue) return false;
    }

    return true;
  });

  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const blockedTasks = filteredTasks.filter((t) => t.status === 'Blocked');
  const doneTasks = filteredTasks.filter((t) => t.status === 'Done');

  const columns: Array<{
    status: TaskStatus;
    title: string;
    icon: React.ReactNode;
    color: string;
    badgeBg: string;
    borderColor: string;
    items: Task[];
  }> = [
    {
      status: 'In Progress',
      title: '进行中 (In Progress)',
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50/50',
      badgeBg: 'bg-blue-100 text-blue-800',
      borderColor: 'border-blue-200',
      items: inProgressTasks,
    },
    {
      status: 'Blocked',
      title: '卡点阻塞 (Blocked)',
      icon: <AlertOctagon className="w-4 h-4 text-red-600 animate-pulse" />,
      color: 'bg-red-50/50',
      badgeBg: 'bg-red-100 text-red-800',
      borderColor: 'border-red-200',
      items: blockedTasks,
    },
    {
      status: 'Done',
      title: '已完成 (Done)',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50/30',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      borderColor: 'border-emerald-200',
      items: doneTasks,
    },
  ];

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 ring-1 ring-rose-300">
            高优先级
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            低优先级
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            中优先级
          </span>
        );
    }
  };

  const renderDeadlineBadge = (deadline: string, status: TaskStatus) => {
    if (status === 'Done') {
      return (
        <span className="inline-flex items-center text-xs text-slate-500 font-mono">
          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
          {deadline}
        </span>
      );
    }

    const isOverdue = deadline < todayStr;
    const isToday = deadline === todayStr;

    if (isOverdue) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-300 font-mono">
          <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" />
          超期 ({deadline})
        </span>
      );
    }

    if (isToday) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 font-mono">
          <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
          今天截止 ({deadline})
        </span>
      );
    }

    return (
      <span className="inline-flex items-center text-xs text-slate-600 font-mono">
        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
        {deadline}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Control Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="input-search-query"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="搜索事项名称、责任人、交付物或卡点..."
            className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Owner */}
          <div className="flex items-center space-x-1">
            <User className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <select
              id="select-owner-filter"
              value={filters.ownerFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, ownerFilter: e.target.value }))}
              className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">责任人: 全部</option>
              {uniqueOwners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Priority */}
          <select
            id="select-priority-filter"
            value={filters.priorityFilter}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, priorityFilter: e.target.value as any }))
            }
            className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">优先级: 全部</option>
            <option value="High">高优先级</option>
            <option value="Medium">中优先级</option>
            <option value="Low">低优先级</option>
          </select>

          {/* Overdue Only Checkbox Toggle */}
          <button
            id="toggle-overdue-only"
            onClick={() => setFilters((prev) => ({ ...prev, overdueOnly: !prev.overdueOnly }))}
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              filters.overdueOnly
                ? 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            仅看超期预警
          </button>

          {/* Reset Filters */}
          {(filters.searchQuery ||
            filters.statusFilter !== 'All' ||
            filters.ownerFilter ||
            filters.priorityFilter !== 'All' ||
            filters.overdueOnly) && (
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  statusFilter: 'All',
                  ownerFilter: '',
                  overdueOnly: false,
                  priorityFilter: 'All',
                })
              }
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 underline cursor-pointer"
            >
              清空筛选
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.status}
            className={`rounded-xl border ${col.borderColor} ${col.color} p-3.5 flex flex-col min-h-[500px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
              <div className="flex items-center space-x-2">
                {col.icon}
                <h3 className="font-bold text-slate-800 text-sm">{col.title}</h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${col.badgeBg}`}
              >
                {col.items.length}
              </span>
            </div>

            {/* Column Items */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {col.items.length === 0 ? (
                <div className="h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center">
                  <Filter className="w-6 h-6 text-slate-300 mb-1" />
                  <p className="text-xs text-slate-400">暂无符合条件的督办事项</p>
                </div>
              ) : (
                col.items.map((task) => {
                  const isOverdue = task.status !== 'Done' && task.deadline < todayStr;

                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-xl p-4 border transition-all shadow-xs hover:shadow-md relative group ${
                        task.status === 'Blocked'
                          ? 'border-red-300 ring-1 ring-red-100'
                          : isOverdue
                          ? 'border-amber-300 ring-1 ring-amber-100'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Priority and Source Tag */}
                      <div className="flex items-center justify-between mb-2 gap-2">
                        {renderPriorityBadge(task.priority)}
                        <span className="text-[11px] text-slate-400 truncate max-w-[150px]" title={task.meetingSource}>
                          {task.meetingSource || '会议提取'}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-slate-800 text-sm leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>

                      {/* Deliverable Box */}
                      {task.deliverable && (
                        <div className="bg-slate-50 rounded-lg p-2 mb-2.5 border border-slate-100">
                          <div className="flex items-start text-xs text-slate-600">
                            <Package className="w-3.5 h-3.5 mr-1.5 text-slate-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{task.deliverable}</span>
                          </div>
                        </div>
                      )}

                      {/* Blocked Reason Warning Banner */}
                      {task.status === 'Blocked' && task.blockedReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 mb-2.5 text-xs text-red-800">
                          <div className="flex items-center font-bold text-red-700 mb-0.5">
                            <AlertOctagon className="w-3.5 h-3.5 mr-1 text-red-600" />
                            卡点阻塞原因:
                          </div>
                          <p className="text-red-700/90 leading-relaxed pl-4">{task.blockedReason}</p>
                        </div>
                      )}

                      {/* Owner and Deadline Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center text-slate-700 font-medium">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold mr-1.5">
                            {task.owner.slice(0, 1)}
                          </div>
                          <span className="truncate max-w-[100px]">{task.owner}</span>
                        </div>
                        {renderDeadlineBadge(task.deadline, task.status)}
                      </div>

                      {/* Quick Action Overlay / Transition Controls */}
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        {/* Status Transition Buttons */}
                        <div className="flex items-center space-x-1">
                          {task.status !== 'In Progress' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'In Progress')}
                              className="px-2 py-1 text-[11px] font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                              title="变更状态为 进行中"
                            >
                              至进行中
                            </button>
                          )}
                          {task.status !== 'Blocked' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'Blocked')}
                              className="px-2 py-1 text-[11px] font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                              title="标记卡点阻塞"
                            >
                              标记卡点
                            </button>
                          )}
                          {task.status !== 'Done' && (
                            <button
                              onClick={() => onUpdateStatus(task.id, 'Done')}
                              className="px-2 py-1 text-[11px] font-medium rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="标记已完成办结"
                            >
                              标记完成
                            </button>
                          )}
                        </div>

                        {/* Edit & Delete Controls */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="编辑任务"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="删除任务"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
