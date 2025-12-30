'use client';

import { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    due_date: string;
    project_name: string;
    assignee_name: string;
    assignee_avatar: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'in_progress': return { label: 'Đang thực hiện', class: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
        case 'in_review': return { label: 'Đang duyệt', class: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' };
        case 'completed': return { label: 'Hoàn thành', class: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' };
        case 'pending': return { label: 'Chờ xử lý', class: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' };
        default: return { label: status, class: 'bg-slate-100 text-slate-600' };
    }
};

const getPriorityBadge = (priority: string) => {
    switch (priority) {
        case 'urgent': return { label: 'Khẩn cấp', class: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' };
        case 'high': return { label: 'Cao', class: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' };
        case 'medium': return { label: 'Trung bình', class: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' };
        case 'low': return { label: 'Thấp', class: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' };
        default: return { label: priority, class: 'bg-slate-100 text-slate-600' };
    }
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const response = await fetch('/api/tasks');
                const result = await response.json();

                if (result.success) {
                    setTasks(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error('Tasks fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
                <h2 className="text-xl font-bold mb-2">Lỗi tải dữ liệu</h2>
                <p className="text-text-muted">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#111418] dark:text-white text-3xl font-black">Quản lý công việc</h1>
                    <p className="text-[#617589] dark:text-slate-400 text-sm">Theo dõi và quản lý tất cả các công việc.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 h-11 shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="text-sm font-bold">Thêm công việc</span>
                </button>
            </div>

            <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-text-muted text-xs uppercase font-semibold">
                                <th className="px-6 py-4">Công việc</th>
                                <th className="px-6 py-4">Dự án</th>
                                <th className="px-6 py-4">Người thực hiện</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Ưu tiên</th>
                                <th className="px-6 py-4 text-right">Hạn chót</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tasks.length > 0 ? (
                                tasks.map((task) => {
                                    const statusBadge = getStatusBadge(task.status);
                                    const priorityBadge = getPriorityBadge(task.priority);

                                    return (
                                        <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-text-main dark:text-white">{task.title}</div>
                                                <div className="text-xs text-text-muted">#TASK-{task.id}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{task.project_name || 'Chưa gán'}</td>
                                            <td className="px-6 py-4">
                                                {task.assignee_name ? (
                                                    <div className="flex items-center gap-2">
                                                        <img
                                                            src={task.assignee_avatar || `https://picsum.photos/id/${task.id + 10}/32/32`}
                                                            className="w-7 h-7 rounded-full object-cover"
                                                            alt={task.assignee_name}
                                                        />
                                                        <span className="text-sm">{task.assignee_name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-slate-400">Chưa gán</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadge.class}`}>{statusBadge.label}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${priorityBadge.class}`}>{priorityBadge.label}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        Chưa có công việc nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
