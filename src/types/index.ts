// Type definitions for PMP Master

export type AppView = 'landing' | 'dashboard' | 'projects' | 'project-detail' | 'settings' | 'tasks' | 'team' | 'reports';

export interface User {
    id: number;
    email: string;
    full_name: string;
    role: string;
    avatar_url?: string;
    position?: string;
    created_at: string;
}

export interface Project {
    id: number;
    name: string;
    client?: string;
    description?: string;
    progress: number;
    status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
    due_date?: string;
    created_by?: number;
    created_at: string;
    team?: User[];
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    project_id: number;
    project_name?: string;
    assignee_id?: number;
    assignee?: User;
    status: 'pending' | 'in_progress' | 'in_review' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    due_date?: string;
    created_at: string;
}

export interface Meeting {
    id: number;
    title: string;
    project_id: number;
    meeting_date: string;
    duration_minutes?: number;
    notes?: string;
    zoom_link?: string;
    created_by?: number;
    attendees?: User[];
    actions?: MeetingAction[];
    created_at: string;
}

export interface MeetingAction {
    id: number;
    meeting_id: number;
    text: string;
    assignee_id?: number;
    assignee?: User;
    linked_task_id?: number;
    completed: boolean;
}

export interface DashboardStats {
    total_projects: number;
    active_projects: number;
    pending_tasks: number;
    tasks_due_today: number;
    overdue_tasks: number;
    team_performance: number;
}
