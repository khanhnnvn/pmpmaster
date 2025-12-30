'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
    id: number;
    name: string;
    client: string;
    progress: number;
    status: string;
    due_date: string;
    member_count: number;
    task_count: number;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'in_progress': return { label: 'Đang thực hiện', class: 'bg-primary' };
        case 'planning': return { label: 'Lập kế hoạch', class: 'bg-orange-400' };
        case 'completed': return { label: 'Hoàn thành', class: 'bg-emerald-500' };
        case 'on_hold': return { label: 'Tạm dừng', class: 'bg-slate-500' };
        default: return { label: status, class: 'bg-primary' };
    }
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const response = await fetch('/api/projects');
                const result = await response.json();

                if (result.success) {
                    setProjects(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error('Projects fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
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
                    <h1 className="text-[#111418] dark:text-white text-3xl font-black">Dự án</h1>
                    <p className="text-[#617589] dark:text-slate-400 text-sm">Quản lý và theo dõi tất cả các dự án đang triển khai.</p>
                </div>
                <Link
                    href="/dashboard/projects/new"
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 h-11 shadow-sm transition-all"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="text-sm font-bold">Tạo dự án</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((p) => {
                    const badge = getStatusBadge(p.status);
                    return (
                        <Link
                            key={p.id}
                            href={`/dashboard/projects/${p.id}`}
                            className="flex flex-col bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer relative"
                        >
                            <div className="p-5 flex flex-col gap-4 flex-1">
                                <div className="flex justify-between items-start">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${badge.class}`}>
                                        {badge.label}
                                    </span>
                                    <button
                                        className="text-slate-400 hover:text-slate-700"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-[#111418] dark:text-white text-lg font-bold group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-sm text-[#617589] dark:text-slate-400">Khách hàng: {p.client || 'Nội bộ'}</p>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tiến độ</span>
                                        <span className={`text-xs font-bold ${p.progress === 100 ? 'text-emerald-500' : 'text-primary'}`}>{p.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div className={`h-2 rounded-full ${p.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${p.progress}%` }}></div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="material-symbols-outlined text-[16px]">group</span>
                                        <span>{p.member_count || 0} thành viên</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[#617589] dark:text-slate-400">
                                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                        <span className="text-xs font-medium">
                                            {p.due_date ? new Date(p.due_date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' }) : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                <Link
                    href="/dashboard/projects/new"
                    className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer min-h-[220px] group"
                >
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-3xl">add</span>
                    </div>
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">Dự án mới</h3>
                    <p className="text-sm text-[#617589] dark:text-slate-400 mt-1">Bắt đầu dự án mới</p>
                </Link>
            </div>
        </div>
    );
}
