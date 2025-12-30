'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
    id: number;
    name: string;
}

interface TeamMember {
    id: number;
    full_name: string;
}

export default function NewTaskPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        project_id: '',
        assignee_id: '',
        status: 'pending',
        priority: 'medium',
        due_date: ''
    });

    useEffect(() => {
        // Fetch projects and team members for dropdowns
        Promise.all([
            fetch('/api/projects').then(r => r.json()),
            fetch('/api/team').then(r => r.json())
        ]).then(([projectsRes, membersRes]) => {
            if (projectsRes.success) setProjects(projectsRes.data);
            if (membersRes.success) setMembers(membersRes.data);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    project_id: formData.project_id ? parseInt(formData.project_id) : null,
                    assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null
                }),
            });

            const result = await response.json();

            if (result.success) {
                router.push('/dashboard/tasks');
            } else {
                setError(result.error || 'Không thể tạo công việc');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error('Create task error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/tasks"
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Thêm công việc mới</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Điền thông tin để tạo công việc mới</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">
                            Tiêu đề <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="VD: Thiết kế giao diện trang chủ"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            placeholder="Chi tiết về công việc..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Dự án
                            </label>
                            <select
                                name="project_id"
                                value={formData.project_id}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="">-- Chọn dự án --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Người thực hiện
                            </label>
                            <select
                                name="assignee_id"
                                value={formData.assignee_id}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="">-- Chọn người --</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.full_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Trạng thái
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="pending">Chờ xử lý</option>
                                <option value="in_progress">Đang thực hiện</option>
                                <option value="in_review">Đang duyệt</option>
                                <option value="completed">Hoàn thành</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Ưu tiên
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                                <option value="urgent">Khẩn cấp</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Hạn chót
                            </label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-11 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Đang tạo...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">add_task</span>
                                Tạo công việc
                            </>
                        )}
                    </button>
                    <Link
                        href="/dashboard/tasks"
                        className="px-6 h-11 rounded-lg border border-slate-300 dark:border-slate-600 text-text-main dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}
