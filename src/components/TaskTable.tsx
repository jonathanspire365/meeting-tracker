import React, { useState } from 'react';
import {
  ArrowUpDown,
  Calendar,
  AlertTriangle,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Edit2,
  Trash2,
  FileSpreadsheet,
  CheckSquare,
  Package,
  Search,
  Filter,
  X
} from 'lucide-react';
import { Task, TaskStatus, TaskFilterState } from '../types.js';
import { exportTasksToExcel } from '../../lib/excelExport.js';

interface TaskTableProps {
  tasks: Task[];
  filters: TaskFilterState;
  setFilters: React.Dispatch<React.SetStateAction<TaskFilterState>>;
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onBatchDelete: (taskIds: string[]) => void;
  onBatchStatusChange: (taskIds: string[], status: TaskStatus) => void;
}

type SortField = 'deadline' | 'priority' | 'status' | 'owner';
type SortOrder = 'asc' | 'desc';

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  filters,
  setFilters,
  onUpdateStatus,
  onEditTask,
  onDeleteTask,
  onBatchDelete,
  onBatchStatusChange,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const uniqueOwners = Array.from(new Set(tasks.map((t) => t.owner))).filter(Boolean);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
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

    if (filters.statusFilter !== 'All' && task.status !== filters.statusFilter) {
      return false;
    }

    if (filters.ownerFilter && task.owner !== filters.ownerFilter) {
      return false;
    }

    if (filters.priorityFilter !== 'All' && task.priority !== filters.priorityFilter) {
      return false;
    }

    if (filters.overdueOnly) {
      const isOverdue = task.status !== 'Done' && task.deadline < todayStr;
      if (!isOverdue) return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'deadline') {
      comparison = a.deadline.localeCompare(b.deadline);
    } else if (sortField === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      comparison = pMap[b.priority] - pMap[a.priority];
    } else if (sortField === 'status') {
      const sMap = { Blocked: 3, 'In Progress': 2, Done: 1 };
      comparison = sMap[b.status] - sMap[a.status];
    } else if (sortField === 'owner') {
      comparison = a.owner.localeCompare(b.owner);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedTasks.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExportSelected = () => {
    const selectedTasks = tasks.filter((t) => selectedIds.includes(t.id));
    exportTasksToExcel(selectedTasks, '选定督办事项');
  };

  const renderStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5 mr-1 text-blue-600" />
            进行中
          </span>
        );
      case 'Blocked':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <AlertOctagon className="w-3.5 h-3.5 mr-1 text-red-600 animate-pulse" />
            卡点阻塞
          </span>
        );
      case 'Done':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            已办结
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="table-search-input"
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            id="table-status-filter"
            value={filters.statusFilter}
            onChange={(e) => setFilters((prev) => ({ ...prev, statusFilter: e.target.value as any }))}
            className="text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">状态: 全部</option>
            <option value="In Progress">进行中</option>
            <option value="Blocked">卡点阻塞</option>
            <option value="Done">已办结</option>
          </select>

          {/* Owner Filter */}
          <select
            id="table-owner-filter"
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

          {/* Overdue Checkbox */}
          <button
            id="table-overdue-toggle"
            onClick={() => setFilters((prev) => ({ ...prev, overdueOnly: !prev.overdueOnly }))}
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              filters.overdueOnly
                ? 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            仅看超期
          </button>
        </div>
      </div>

      {/* Batch Operations Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-900 text-white p-3 rounded-xl shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-indigo-300" />
            <span>
              已选择 <strong className="font-mono text-indigo-200">{selectedIds.length}</strong> 项督办任务
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBatchStatusChange(selectedIds, 'Done')}
              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium cursor-pointer"
            >
              一键标记办结
            </button>
            <button
              onClick={handleExportSelected}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium cursor-pointer flex items-center"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              导出所选
            </button>
            <button
              onClick={() => {
                onBatchDelete(selectedIds);
                setSelectedIds([]);
              }}
              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 text-white font-medium cursor-pointer"
            >
              批量删除
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    id="checkbox-select-all"
                    type="checkbox"
                    checked={
                      sortedTasks.length > 0 && selectedIds.length === sortedTasks.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-3">督办事项 / 来源</th>
                <th
                  onClick={() => toggleSort('owner')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>责任人</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('deadline')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>截止日期</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">交付物成果</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>当前状态</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 min-w-[180px]">卡点阻碍说明</th>
                <th
                  onClick={() => toggleSort('priority')}
                  className="p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>优先级</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    没有找到匹配的督办事项
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task) => {
                  const isOverdue = task.status !== 'Done' && task.deadline < todayStr;
                  const isSelected = selectedIds.includes(task.id);

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      } ${task.status === 'Blocked' ? 'bg-red-50/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(task.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* Title & Source */}
                      <td className="p-3 max-w-[260px]">
                        <div className="font-semibold text-slate-800 leading-snug">
                          {task.title}
                        </div>
                        {task.meetingSource && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {task.meetingSource}
                          </div>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center font-medium text-slate-700">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold mr-1.5">
                            {task.owner.slice(0, 1)}
                          </div>
                          <span>{task.owner}</span>
                        </div>
                      </td>

                      {/* Deadline & Overdue badge */}
                      <td className="p-3 whitespace-nowrap font-mono">
                        {task.status !== 'Done' && isOverdue ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" />
                            {task.deadline} (已超期)
                          </span>
                        ) : (
                          <span className="text-slate-600 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {task.deadline}
                          </span>
                        )}
                      </td>

                      {/* Deliverable */}
                      <td className="p-3 max-w-[200px]">
                        <div className="text-xs text-slate-600 line-clamp-2">
                          {task.deliverable || '-'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          {renderStatusBadge(task.status)}
                          {/* Quick Status Dropdown */}
                          <select
                            value={task.status}
                            onChange={(e) =>
                              onUpdateStatus(task.id, e.target.value as TaskStatus)
                            }
                            className="text-[11px] border border-slate-200 rounded px-1 py-0.5 text-slate-600 bg-slate-50 focus:outline-none"
                          >
                            <option value="In Progress">进行中</option>
                            <option value="Blocked">卡点阻塞</option>
                            <option value="Done">已办结</option>
                          </select>
                        </div>
                      </td>

                      {/* Blocked Reason */}
                      <td className="p-3">
                        {task.status === 'Blocked' && task.blockedReason ? (
                          <div className="text-xs text-red-700 bg-red-50 p-1.5 rounded border border-red-200">
                            <strong>阻塞: </strong>
                            {task.blockedReason}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">无</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="p-3 whitespace-nowrap">
                        {task.priority === 'High' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            高
                          </span>
                        ) : task.priority === 'Low' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                            低
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800">
                            中
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  );
};
