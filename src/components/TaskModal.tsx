import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertOctagon, Plus, Save } from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '../types.js';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
}) => {
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [deadline, setDeadline] = useState('');
  const [deliverable, setDeliverable] = useState('');
  const [status, setStatus] = useState<TaskStatus>('In Progress');
  const [blockedReason, setBlockedReason] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [meetingSource, setMeetingSource] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setOwner(initialTask.owner || '');
      setDeadline(initialTask.deadline || '');
      setDeliverable(initialTask.deliverable || '');
      setStatus(initialTask.status || 'In Progress');
      setBlockedReason(initialTask.blockedReason || '');
      setPriority(initialTask.priority || 'Medium');
      setMeetingSource(initialTask.meetingSource || '');
    } else {
      // Default new task values
      setTitle('');
      setOwner('');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7); // Default 7 days later
      setDeadline(defaultDate.toISOString().split('T')[0]);
      setDeliverable('');
      setStatus('In Progress');
      setBlockedReason('');
      setPriority('Medium');
      setMeetingSource('手动新增事项');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('请输入任务名称');
      return;
    }
    if (!owner.trim()) {
      alert('请输入责任人姓名');
      return;
    }

    onSave({
      id: initialTask ? initialTask.id : undefined,
      title: title.trim(),
      owner: owner.trim(),
      deadline: deadline || new Date().toISOString().split('T')[0],
      deliverable: deliverable.trim(),
      status,
      blockedReason: status === 'Blocked' ? blockedReason.trim() : '',
      priority,
      meetingSource: meetingSource.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            {initialTask ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialTask ? '编辑督办事项' : '新增督办事项'}
            </h3>
            <p className="text-xs text-slate-500">
              请填写明确的责任人、截止时间与交付物成果要求
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              督办事项名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="如：完成与第三方仓储系统的 API 接口联调"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Owner & Deadline Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                责任人 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="如：张伟 (架构师)"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                截止日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Deliverable */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              交付物 / 终态成果描述
            </label>
            <input
              type="text"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
              placeholder="如：交付《接口说明文档及联调测试报告》"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                当前状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
              >
                <option value="In Progress">⚡ 进行中 (In Progress)</option>
                <option value="Blocked">🚨 卡点阻塞 (Blocked)</option>
                <option value="Done">✅ 已完成办结 (Done)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              >
                <option value="High">🔴 高优先级</option>
                <option value="Medium">🟡 中优先级</option>
                <option value="Low">🟢 低优先级</option>
              </select>
            </div>
          </div>

          {/* Blocked Reason Input (Highlighted when status === 'Blocked') */}
          {status === 'Blocked' && (
            <div className="bg-red-50 p-3 rounded-xl border border-red-200 animate-fadeIn">
              <label className="block text-xs font-bold text-red-800 mb-1 flex items-center">
                <AlertOctagon className="w-3.5 h-3.5 mr-1 text-red-600" />
                卡点阻碍原因详细说明 <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                rows={2}
                value={blockedReason}
                onChange={(e) => setBlockedReason(e.target.value)}
                placeholder="请详细记录阻塞原因、涉及依赖方及所需上级协调事项..."
                className="w-full px-3 py-2 text-xs bg-white border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-red-900"
              />
            </div>
          )}

          {/* Meeting Source */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              归属会议 / 来源
            </label>
            <input
              type="text"
              value={meetingSource}
              onChange={(e) => setMeetingSource(e.target.value)}
              placeholder="如：2026-08-01 供应链数字化项目调度例会"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition-all cursor-pointer flex items-center"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              保存事项
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
