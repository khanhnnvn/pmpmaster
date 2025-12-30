'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardData {
    overview: {
        total_projects: number;
        active_projects: number;
        pending_tasks: number;
        tasks_due_today: number;
        overdue_tasks: number;
        team_performance: number;
    };
    recent_tasks: Array<{
        id: number;
        title: string;
        status: string;
        due_date: string;
        project_name: string;
        assignee_name: string;
    }>;
    project_health: Array<{
        id: number;
        name: string;
        progress: number;
        status: string;
    }>;
}

const StatCard = ({ title, value, trend, icon, color, isWarning = false }: {
    title: string;
    value: string | number;
    trend: string;
    icon: string;
    color: string;
    isWarning?: boolean;
}) => (
    <div className={`bg-white dark:bg-card-dark p-6 rounded-xl border ${isWarning ? 'border-red-100 dark:border-red-900/30' : 'border-slate-100 dark:border-gray-800'} shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group`}>
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className={`material-symbols-outlined text-6xl ${color}`}>{icon}</span>
        </div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-[#111418] dark:text-white mt-1">{value}</h3>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isWarning ? 'text-red-600' : 'text-emerald-600'}`}>
            <span className="material-symbols-outlined text-[16px]">{isWarning ? 'priority_high' : 'trending_up'}</span>
            <span>{trend}</span>
        </div>
    </div>
);

const TableRow = ({ task }: { task: DashboardData['recent_tasks'][0] }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in_progress': return 'blue';
            case 'in_review': return 'yellow';
            case 'completed': return 'emerald';
            case 'overdue': return 'red';
            default: return 'blue';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'in_progress': return 'Đang thực hiện';
            case 'in_review': return 'Đang duyệt';
            case 'completed': return 'Hoàn thành';
            case 'overdue': return 'Quá hạn';
            case 'pending': return 'Chờ xử lý';
            default: return status;
        }
    };

    const colors: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    };

    const statusColor = getStatusColor(task.status);
    const isOverdue = task.status === 'overdue' || (task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed');

    return (
        <tr className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="p-4 font-medium text-[#111418] dark:text-white">{task.title}</td>
            <td className="p-4 text-slate-500 dark:text-slate-400">{task.project_name || 'Chưa gán'}</td>
            <td className="p-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[statusColor]}`}>
                    {getStatusLabel(task.status)}
                </span>
            </td>
            <td className={`p-4 text-right ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' }) : '-'}
            </td>
        </tr>
    );
};

const HealthItem = ({ project }: { project: DashboardData['project_health'][0] }) => {
    const getProgressColor = (progress: number) => {
        if (progress >= 75) return 'bg-emerald-500';
        if (progress >= 50) return 'bg-primary';
        if (progress >= 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getStatusLabel = (status: string, progress: number) => {
        if (progress >= 75) return 'Sắp hoàn thành';
        if (status === 'in_progress') return 'Đang tiến hành';
        if (status === 'planning') return 'Đang lập kế hoạch';
        return 'Đúng tiến độ';
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full ${getProgressColor(project.progress)}`}></div>
                    <span className="font-bold text-sm text-[#111418] dark:text-white">{project.name}</span>
                </div>
                <span className="text-xs font-medium text-slate-500">{project.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full ${getProgressColor(project.progress)}`} style={{ width: `${project.progress}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">{getStatusLabel(project.status, project.progress)}</p>
        </div>
    );
};

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const response = await fetch('/api/dashboard');
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
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

    const overview = data?.overview || {
        total_projects: 0,
        active_projects: 0,
        pending_tasks: 0,
        tasks_due_today: 0,
        overdue_tasks: 0,
        team_performance: 0
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white tracking-tight">Tổng quan bảng điều khiển</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Chào buổi sáng! Dưới đây là tình hình các dự án của bạn hôm nay.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white dark:bg-card-dark px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <span>Hôm nay, {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng số dự án"
                    value={overview.total_projects}
                    trend={`+${overview.active_projects} đang chạy`}
                    icon="work"
                    color="text-primary"
                />
                <StatCard
                    title="Công việc chờ xử lý"
                    value={overview.pending_tasks}
                    trend={`${overview.tasks_due_today} đến hạn hôm nay`}
                    icon="check_circle"
                    color="text-primary"
                />
                <StatCard
                    title="Công việc quá hạn"
                    value={overview.overdue_tasks}
                    trend={overview.overdue_tasks > 0 ? "Cần chú ý" : "Tốt!"}
                    icon="warning"
                    color="text-red-500"
                    isWarning={overview.overdue_tasks > 0}
                />
                <StatCard
                    title="Hiệu suất đội ngũ"
                    value={`${overview.team_performance}%`}
                    trend={overview.team_performance >= 90 ? "Xuất sắc!" : "+12% tuần này"}
                    icon="bolt"
                    color="text-primary"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-[#111418] dark:text-white">Công việc cập nhật gần đây</h3>
                        <Link href="/dashboard/tasks" className="text-sm font-bold text-primary hover:text-primary/80">Xem tất cả</Link>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-gray-800 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-gray-800/50">
                                        <th className="p-4 font-semibold">Tên công việc</th>
                                        <th className="p-4 font-semibold">Dự án</th>
                                        <th className="p-4 font-semibold">Trạng thái</th>
                                        <th className="p-4 font-semibold text-right">Hạn chót</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {data?.recent_tasks && data.recent_tasks.length > 0 ? (
                                        data.recent_tasks.map(task => (
                                            <TableRow key={task.id} task={task} />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-slate-500">Chưa có công việc nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <h3 className="text-xl font-bold text-[#111418] dark:text-white">Sức khỏe dự án</h3>
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-800 p-6 flex flex-col gap-6 shadow-sm">
                        {data?.project_health && data.project_health.length > 0 ? (
                            data.project_health.map((project, index) => (
                                <div key={project.id}>
                                    <HealthItem project={project} />
                                    {index < data.project_health.length - 1 && (
                                        <div className="h-px bg-slate-100 dark:bg-gray-800 mt-6"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-slate-500 py-4">Chưa có dự án nào</p>
                        )}

                        <div className="mt-2 pt-4 border-t border-slate-100 dark:border-gray-800">
                            <Link href="/dashboard/projects" className="w-full py-2 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center">
                                Xem tất cả dự án
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
