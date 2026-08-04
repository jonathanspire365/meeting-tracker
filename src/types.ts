/**
 * Task and Application Types for Meeting Action Item Tracker
 */

export type TaskStatus = 'In Progress' | 'Blocked' | 'Done';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  owner: string;
  deadline: string; // YYYY-MM-DD
  deliverable: string;
  status: TaskStatus;
  blockedReason?: string;
  priority: TaskPriority;
  meetingSource?: string; // e.g. "2026-08-01 供应链数字化项目周会"
  createdAt: string;
  updatedAt: string;
}

export interface TaskFilterState {
  searchQuery: string;
  statusFilter: TaskStatus | 'All';
  ownerFilter: string;
  overdueOnly: boolean;
  priorityFilter: TaskPriority | 'All';
}

export type ViewMode = 'board' | 'list';

export interface ExtractionResponse {
  success: boolean;
  meetingTitle?: string;
  tasks: Array<{
    title: string;
    owner: string;
    deadline: string;
    deliverable: string;
    status: TaskStatus;
    blockedReason?: string;
    priority?: TaskPriority;
  }>;
  summary?: string;
  error?: string;
}

export interface ExtractionRequest {
  text?: string;
  file?: {
    name: string;
    mimeType: string;
    base64Data: string;
  };
  meetingContext?: string;
}
