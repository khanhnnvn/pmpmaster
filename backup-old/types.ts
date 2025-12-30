
export type AppView = 'landing' | 'dashboard' | 'projects' | 'project-detail' | 'settings' | 'tasks' | 'team' | 'reports';

export interface Project {
  id: string;
  name: string;
  client: string;
  progress: number;
  status: 'In Progress' | 'Planning' | 'Completed';
  dueDate: string;
  team: string[];
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assignee: string;
  status: 'In Progress' | 'In Review' | 'Overdue' | 'Completed';
  dueDate: string;
}

export interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  month: string;
  time: string;
  attendees: string[];
  notes: string;
  actions: { id: string; text: string; assignee: string; linked?: boolean }[];
}
