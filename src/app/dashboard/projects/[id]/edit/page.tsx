'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
    id: number;
    name: string;
    client: string;
    description: string;
    status: string;
    due_date: string;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        description: '',
        status: 'planning',
        due_date: ''
    });

    useEffect(() => {
        async function fetchProject() {
            try {
                const response = await fetch(`/api/projects/${id}`);
                const result = await response.json();

                if (result.success) {
                    const project: Project = result.data;
                    setFormData({
                        name: project.name || '',
                        client: project.client || '',
                        description: project.description || '',
                        status: project.status || 'planning',
                        due_date: project.due_date ? project.due_date.split('T')[0] : ''
                    });
                } else {
                    setError('Không tìm thấy dự án');
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error('Fetch project error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchProject();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                router.push(`/dashboard/projects/${id}`);
            } else {
                setError(result.error || 'Không thể cập nhật dự án');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error('Update project error:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bạn có chắc chắn muốn xóa dự án này? Tất cả công việc và biên bản họp liên quan sẽ bị xóa.')) {
            return;
        }

        try {
            const response = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                router.push('/dashboard/projects');
            } else {
                setError(result.error || 'Không thể xóa dự án');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error('Delete project error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link
                    href={`/dashboard/projects/${id}`}
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Chỉnh sửa dự án</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Cập nhật thông tin dự án</p>
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
                            Tên dự án <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">
                            Khách hàng
                        </label>
                        <input
                            type="text"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                            rows={4}
                            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <option value="planning">Lập kế hoạch</option>
                                <option value="in_progress">Đang thực hiện</option>
                                <option value="on_hold">Tạm dừng</option>
                                <option value="completed">Hoàn thành</option>
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
                        disabled={saving}
                        className="flex-1 h-11 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 h-11 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Xóa
                    </button>
                </div>
            </form>
        </div>
    );
}
