'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTeamMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        full_name: '',
        position: '',
        role: 'user',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                router.push('/dashboard/team');
            } else {
                setError(result.error || 'Không thể thêm thành viên');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
            console.error('Create member error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/team"
                    className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#111418] dark:text-white">Thêm thành viên mới</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Thêm người dùng mới vào hệ thống</p>
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
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="VD: Nguyễn Văn A"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="email@congty.com"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">
                            Mật khẩu <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Mật khẩu đăng nhập"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Chức vụ
                            </label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="VD: Developer"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">
                                Vai trò
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="user">Thành viên</option>
                                <option value="manager">Quản lý</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
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
                                Đang thêm...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">person_add</span>
                                Thêm thành viên
                            </>
                        )}
                    </button>
                    <Link
                        href="/dashboard/team"
                        className="px-6 h-11 rounded-lg border border-slate-300 dark:border-slate-600 text-text-main dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center"
                    >
                        Hủy
                    </Link>
                </div>
            </form>
        </div>
    );
}
