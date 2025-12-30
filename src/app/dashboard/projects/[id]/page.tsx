'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
    assignee_name: string;
}

interface Member {
    id: number;
    full_name: string;
    email: string;
    position: string;
    avatar_url: string;
    role: string;
}

interface Meeting {
    id: number;
    title: string;
    meeting_date: string;
    duration_minutes: number;
    notes: string;
}

interface Project {
    id: number;
    name: string;
    client: string;
    description: string;
    progress: number;
    status: string;
    due_date: string;
    created_at: string;
    task_count: number;
    completed_tasks: number;
    members: Member[];
    tasks: Task[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'in_progress': return { label: 'Đang thực hiện', class: 'bg-blue-500 text-white' };
        case 'planning': return { label: 'Lập kế hoạch', class: 'bg-orange-400 text-white' };
        case 'completed': return { label: 'Hoàn thành', class: 'bg-emerald-500 text-white' };
        case 'on_hold': return { label: 'Tạm dừng', class: 'bg-slate-500 text-white' };
        case 'pending': return { label: 'Chờ xử lý', class: 'bg-slate-100 text-slate-600' };
        default: return { label: status, class: 'bg-primary text-white' };
    }
};

const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'urgent': return { label: 'Khẩn cấp', class: 'bg-red-100 text-red-700' };
        case 'high': return { label: 'Cao', class: 'bg-orange-100 text-orange-700' };
        case 'medium': return { label: 'Trung bình', class: 'bg-blue-100 text-blue-700' };
        case 'low': return { label: 'Thấp', class: 'bg-slate-100 text-slate-600' };
        default: return { label: priority, class: 'bg-slate-100 text-slate-600' };
    }
};

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'tasks' | 'meetings'>('tasks');

    useEffect(() => {
        async function fetchData() {
            try {
                const [projectRes, meetingsRes] = await Promise.all([
                    fetch(`/api/projects/${id}`).then(r => r.json()),
                    fetch(`/api/meetings?project_id=${id}`).then(r => r.json())
                ]);

                if (projectRes.success) {
                    setProject(projectRes.data);
                } else {
                    setError(projectRes.error || 'Không tìm thấy dự án');
                }

                if (meetingsRes.success) {
                    setMeetings(meetingsRes.data);
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                <h2 className="text-xl font-bold mb-2">Lỗi</h2>
                <p className="text-text-muted mb-4">{error || 'Không tìm thấy dự án'}</p>
                <Link href="/dashboard/projects" className="text-primary hover:underline">
                    ← Quay lại danh sách dự án
                </Link>
            </div>
        );
    }

    const statusBadge = getStatusBadge(project.status);

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link
                    href="/dashboard/projects"
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-[#111418] dark:text-white">{project.name}</h1>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusBadge.class}`}>
                            {statusBadge.label}
                        </span>
                    </div>
                    <p className="text-text-muted">
                        Khách hàng: {project.client || 'Nội bộ'} • Tạo ngày {new Date(project.created_at).toLocaleDateString('vi-VN')}
                    </p>
                </div>
                <Link
                    href={`/dashboard/tasks/new?project_id=${id}`}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-4 h-10 text-sm font-bold"
                >
                    <span className="material-symbols-outlined text-[18px]">add_task</span>
                    Thêm công việc
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-text-muted mb-1">Tiến độ</p>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-primary">{project.progress}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-text-muted mb-1">Công việc</p>
                    <span className="text-2xl font-bold">{project.completed_tasks || 0}/{project.task_count || 0}</span>
                </div>
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-text-muted mb-1">Thành viên</p>
                    <span className="text-2xl font-bold">{project.members?.length || 0}</span>
                </div>
                <div className="bg-white dark:bg-card-dark rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-text-muted mb-1">Hạn chót</p>
                    <span className="text-lg font-bold">
                        {project.due_date ? new Date(project.due_date).toLocaleDateString('vi-VN') : '-'}
                    </span>
                </div>
            </div>

            {/* Description */}
            {project.description && (
                <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold mb-2">Mô tả</h3>
                    <p className="text-text-muted">{project.description}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tasks' ? 'bg-white dark:bg-card-dark shadow-sm' : 'hover:bg-white/50'
                        }`}
                >
                    Công việc ({project.tasks?.length || 0})
                </button>
                <button
                    onClick={() => setActiveTab('meetings')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'meetings' ? 'bg-white dark:bg-card-dark shadow-sm' : 'hover:bg-white/50'
                        }`}
                >
                    Biên bản họp ({meetings.length})
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'tasks' && (
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {project.tasks && project.tasks.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-text-muted">
                                    <th className="px-6 py-3">Công việc</th>
                                    <th className="px-6 py-3">Người thực hiện</th>
                                    <th className="px-6 py-3">Trạng thái</th>
                                    <th className="px-6 py-3">Ưu tiên</th>
                                    <th className="px-6 py-3 text-right">Hạn chót</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {project.tasks.map(task => {
                                    const taskStatus = getStatusBadge(task.status);
                                    const taskPriority = getPriorityBadge(task.priority);
                                    return (
                                        <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{task.title}</div>
                                                <div className="text-xs text-text-muted">#TASK-{task.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">{task.assignee_name || 'Chưa gán'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${taskStatus.class}`}>{taskStatus.label}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${taskPriority.class}`}>{taskPriority.label}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2">task</span>
                            <p>Chưa có công việc nào</p>
                            <Link href={`/dashboard/tasks/new?project_id=${id}`} className="text-primary hover:underline text-sm">
                                + Thêm công việc mới
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'meetings' && (
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {meetings.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {meetings.map(meeting => (
                                <div key={meeting.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold">{meeting.title}</h3>
                                        <span className="text-sm text-text-muted">
                                            {new Date(meeting.meeting_date).toLocaleDateString('vi-VN')} • {meeting.duration_minutes} phút
                                        </span>
                                    </div>
                                    {meeting.notes && (
                                        <p className="text-text-muted text-sm line-clamp-2">{meeting.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-text-muted">
                            <span className="material-symbols-outlined text-4xl mb-2">event_note</span>
                            <p>Chưa có biên bản họp nào</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
