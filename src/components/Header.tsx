import React from 'react';
import {
  Sparkles,
  Plus,
  FileSpreadsheet,
  RotateCcw,
  LayoutGrid,
  ListFilter,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { ViewMode } from '../types.js';

interface HeaderProps {
  activeTab: 'meeting-tracker' | 'bidding-analyzer';
  setActiveTab: (tab: 'meeting-tracker' | 'bidding-analyzer') => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenExtractModal: () => void;
  onOpenCreateModal: () => void;
  onExportExcel: () => void;
  onResetSampleData: () => void;
  taskCount: number;
  blockedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onOpenExtractModal,
  onOpenCreateModal,
  onExportExcel,
  onResetSampleData,
  taskCount,
  blockedCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner & Title Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                会议遗留事项智能督办与跟踪看板
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 ring-1 ring-inset ring-indigo-500/30">
                Gemini 2.5/3.6 Powered
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              智能分析会议纪要 · 责任到人追溯 · 阻塞卡点实时预警 · 闭环督办看板
            </p>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Task Extraction Trigger */}
          <button
            id="btn-ai-extract"
            onClick={onOpenExtractModal}
            className="inline-flex items-center px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-1.5 animate-pulse text-amber-200" />
            AI 智能提取遗留事项
          </button>

          {/* Create Task Button */}
          <button
            id="btn-add-task"
            onClick={onOpenCreateModal}
            className="inline-flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1 text-slate-300" />
            手动新增
          </button>

          {/* Export Excel Button */}
          <button
            id="btn-export-excel"
            onClick={onExportExcel}
            className="inline-flex items-center px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/80 transition-colors cursor-pointer"
            title="导出当前督办任务列表为 Excel .xlsx"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-400" />
            导出 Excel
          </button>

          {/* Reset / Sample Data */}
          <button
            id="btn-reset-sample"
            onClick={onResetSampleData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="重置/重新加载示例会议数据"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs & View Controls */}
      <div className="bg-slate-950/60 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
          {/* Main Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2" aria-label="Tabs">
            <button
              id="tab-meeting-tracker"
              onClick={() => setActiveTab('meeting-tracker')}
              className={`inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                activeTab === 'meeting-tracker'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <FileText className="w-4 h-4 mr-1.5 text-indigo-400" />
              📌 会议遗留事项督办看板
              <span className="ml-2 bg-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded-full font-mono">
                {taskCount}
              </span>
              {blockedCount > 0 && (
                <span className="ml-1.5 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full ring-1 ring-red-500/30 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-0.5 inline" />
                  {blockedCount}
                </span>
              )}
            </button>

            {/* Reserved Feature Extension Tab */}
            <button
              id="tab-bidding-analyzer"
              onClick={() => setActiveTab('bidding-analyzer')}
              className={`inline-flex items-center px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all relative cursor-pointer ${
                activeTab === 'bidding-analyzer'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <FolderOpen className="w-4 h-4 mr-1.5 text-amber-400" />
              📑 招标文件智能解析与比对
              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40">
                扩展预留
              </span>
            </button>
          </nav>

          {/* View Switcher (Kanban Board vs List Table) */}
          {activeTab === 'meeting-tracker' && (
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 self-end sm:self-auto">
              <button
                id="view-mode-board"
                onClick={() => setViewMode('board')}
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 mr-1" />
                看板视图
              </button>
              <button
                id="view-mode-list"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5 mr-1" />
                表格视图
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
