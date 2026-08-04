import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, ViewMode, TaskFilterState } from './types.js';
import { SAMPLE_TASKS } from './data/sampleMeetings.js';
import { Header } from './components/Header.js';
import { TaskStats } from './components/TaskStats.js';
import { TaskBoard } from './components/TaskBoard.js';
import { TaskTable } from './components/TaskTable.js';
import { TaskModal } from './components/TaskModal.js';
import { FileUploaderModal } from './components/FileUploaderModal.js';
import { BiddingAnalyzerModal } from './components/BiddingAnalyzerModal.js';
import { exportTasksToExcel } from '../lib/excelExport.js';

const LOCAL_STORAGE_KEY = 'meeting_supervision_tasks';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage:', e);
    }
    return SAMPLE_TASKS;
  });

  const [activeTab, setActiveTab] = useState<'meeting-tracker' | 'bidding-analyzer'>('meeting-tracker');
  const [viewMode, setViewMode] = useState<ViewMode>('board');

  const [filters, setFilters] = useState<TaskFilterState>({
    searchQuery: '',
    statusFilter: 'All',
    ownerFilter: '',
    overdueOnly: false,
    priorityFilter: 'All',
  });

  // Modal states
  const [isExtractModalOpen, setIsExtractModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage:', e);
    }
  }, [tasks]);

  // Status Change Handler
  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  // Save Task (Create or Update)
  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString();

    if (taskData.id) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                updatedAt: now,
              }
            : t
        )
      );
    } else {
      // Create new
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('确认删除此项督办任务？')) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  // Batch Delete
  const handleBatchDelete = (taskIds: string[]) => {
    if (window.confirm(`确认删除已选中的 ${taskIds.length} 项督办任务？`)) {
      setTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));
    }
  };

  // Batch Status Change
  const handleBatchStatusChange = (taskIds: string[], status: TaskStatus) => {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        taskIds.includes(t.id)
          ? {
              ...t,
              status,
              updatedAt: now,
            }
          : t
      )
    );
  };

  // Import AI Extracted Tasks
  const handleImportExtractedTasks = (
    newTasksData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[]
  ) => {
    const now = new Date().toISOString();
    const createdTasks: Task[] = newTasksData.map((t, index) => ({
      ...t,
      id: `task-ai-${Date.now()}-${index}`,
      createdAt: now,
      updatedAt: now,
    }));

    setTasks((prev) => [...createdTasks, ...prev]);
  };

  // Export Filtered Tasks to Excel
  const handleExportExcel = () => {
    // Export based on active filters
    const todayStr = new Date().toISOString().split('T')[0];
    const filtered = tasks.filter((task) => {
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

    exportTasksToExcel(filtered, '会议遗留事项督办清单');
  };

  // Reset to Sample Data
  const handleResetSampleData = () => {
    if (window.confirm('重新加载示例会议数据将重置当前看板数据，确定继续吗？')) {
      setTasks(SAMPLE_TASKS);
      setFilters({
        searchQuery: '',
        statusFilter: 'All',
        ownerFilter: '',
        overdueOnly: false,
        priorityFilter: 'All',
      });
    }
  };

  const blockedCount = tasks.filter((t) => t.status === 'Blocked').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased pb-16">
      {/* Top Header & Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenExtractModal={() => setIsExtractModalOpen(true)}
        onOpenCreateModal={() => {
          setEditingTask(null);
          setIsTaskModalOpen(true);
        }}
        onExportExcel={handleExportExcel}
        onResetSampleData={handleResetSampleData}
        taskCount={tasks.length}
        blockedCount={blockedCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'meeting-tracker' ? (
          <>
            {/* KPI Statistics Dashboard */}
            <TaskStats
              tasks={tasks}
              filters={filters}
              setFilters={setFilters}
            />

            {/* View Mode: Kanban Board or List Table */}
            {viewMode === 'board' ? (
              <TaskBoard
                tasks={tasks}
                filters={filters}
                setFilters={setFilters}
                onUpdateStatus={handleUpdateStatus}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
              />
            ) : (
              <TaskTable
                tasks={tasks}
                filters={filters}
                setFilters={setFilters}
                onUpdateStatus={handleUpdateStatus}
                onEditTask={(task) => {
                  setEditingTask(task);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={handleDeleteTask}
                onBatchDelete={handleBatchDelete}
                onBatchStatusChange={handleBatchStatusChange}
              />
            )}
          </>
        ) : (
          /* Tab 2: Bidding Analyzer Reserved Feature Module */
          <BiddingAnalyzerModal />
        )}
      </main>

      {/* Manual Task Modal (Create & Edit) */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      {/* AI File & Text Extraction Modal */}
      <FileUploaderModal
        isOpen={isExtractModalOpen}
        onClose={() => setIsExtractModalOpen(false)}
        onImportTasks={handleImportExtractedTasks}
      />
    </div>
  );
}
