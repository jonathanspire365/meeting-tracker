import React from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ListTodo,
  AlertOctagon,
  TrendingUp,
} from 'lucide-react';
import { Task, TaskFilterState } from '../types.js';

interface TaskStatsProps {
  tasks: Task[];
  filters: TaskFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterState>>;
}

export const TaskStats: React.FC<TaskStatsProps> = ({
  tasks,
  filters,
  setFilters,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const totalCount = tasks.length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const blockedCount = tasks.filter((t) => t.status === 'Blocked').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;
  const overdueCount = tasks.filter(
    (t) => t.status !== 'Done' && t.deadline < todayStr
  ).length;

  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {/* Stat 1: Total */}
      <div
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            statusFilter: 'All',
            overdueOnly: false,
          }))
        }
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          filters.statusFilter === 'All' && !filters.overdueOnly
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/30'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">督办事项总数</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-800 font-mono">{totalCount}</span>
          <span className="text-xs text-slate-400">全部事项</span>
        </div>
      </div>

      {/* Stat 2: In Progress */}
      <div
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            statusFilter: 'In Progress',
            overdueOnly: false,
          }))
        }
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          filters.statusFilter === 'In Progress' && !filters.overdueOnly
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">进行中事项</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-blue-700 font-mono">{inProgressCount}</span>
          <span className="text-xs text-blue-600 font-medium">正常跟进</span>
        </div>
      </div>

      {/* Stat 3: Blocked (Alert) */}
      <div
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            statusFilter: 'Blocked',
            overdueOnly: false,
          }))
        }
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          filters.statusFilter === 'Blocked'
            ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/40'
            : 'border-red-200 hover:border-red-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-red-600">卡点阻塞项</span>
          <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-red-700 font-mono">{blockedCount}</span>
          <span className="text-xs font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
            需领导协调
          </span>
        </div>
      </div>

      {/* Stat 4: Overdue */}
      <div
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            overdueOnly: !prev.overdueOnly,
          }))
        }
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          filters.overdueOnly
            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40'
            : 'border-amber-200 hover:border-amber-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-700">预警超期项</span>
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-amber-800 font-mono">{overdueCount}</span>
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              filters.overdueOnly ? 'bg-amber-200 text-amber-900' : 'text-amber-700 bg-amber-50'
            }`}
          >
            {filters.overdueOnly ? '已开启高亮' : '点击筛选'}
          </span>
        </div>
      </div>

      {/* Stat 5: Done & Completion Rate */}
      <div
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            statusFilter: 'Done',
            overdueOnly: false,
          }))
        }
        className={`bg-white rounded-xl p-3.5 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          filters.statusFilter === 'Done'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">已办结归档</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-emerald-700 font-mono">{doneCount}</span>
            <span className="text-xs text-slate-400">/{totalCount}</span>
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {completionRate}%
          </span>
        </div>
      </div>
    </div>
  );
};
