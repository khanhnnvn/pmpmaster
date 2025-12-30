'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TeamMember {
    id: number;
    email: string;
    full_name: string;
    role: string;
    position: string;
    avatar_url: string;
    project_count: number;
    task_count: number;
    completed_tasks: number;
}

export default function TeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTeam() {
            try {
                const response = await fetch('/api/team');
                const result = await response.json();

                if (result.success) {
                    setMembers(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError('Không thể kết nối đến server');
                console.error('Team fetch error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTeam();
    }, []);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Bạn có chắc chắn muốn xóa thành viên "${name}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/team/${id}`, { method: 'DELETE' });
            const result = await response.json();

            if (result.success) {
                setMembers(members.filter(m => m.id !== id));
            } else {
                alert(result.error || 'Không thể xóa thành viên');
            }
        } catch (err) {
            alert('Không thể kết nối đến server');
            console.error('Delete member error:', err);
        }
    };

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
                    <h1 className="text-[#111418] dark:text-white text-3xl font-black">Đội ngũ</h1>
                    <p className="text-[#617589] dark:text-slate-400 text-sm">Quản lý thành viên và phân công công việc.</p>
                </div>
                <Link href="/dashboard/team/new" className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 h-11 shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    <span className="text-sm font-bold">Thêm thành viên</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all">
                        <div className="flex items-start gap-4 mb-4">
                            <img
                                src={member.avatar_url || `https://picsum.photos/id/${member.id + 60}/80/80`}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                                alt={member.full_name}
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-[#111418] dark:text-white">{member.full_name}</h3>
                                <p className="text-sm text-text-muted">{member.position || member.role}</p>
                                <p className="text-xs text-slate-400 mt-1">{member.email}</p>
                            </div>
                            <div className="flex gap-1">
                                <Link
                                    href={`/dashboard/team/${member.id}/edit`}
                                    className="text-slate-400 hover:text-primary p-1"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </Link>
                                <button
                                    onClick={() => handleDelete(member.id, member.full_name)}
                                    className="text-slate-400 hover:text-red-500 p-1"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex-1 text-center">
                                <p className="text-2xl font-bold text-primary">{member.project_count || 0}</p>
                                <p className="text-xs text-text-muted">Dự án</p>
                            </div>
                            <div className="flex-1 text-center border-l border-slate-100 dark:border-slate-700">
                                <p className="text-2xl font-bold text-primary">{member.task_count || 0}</p>
                                <p className="text-xs text-text-muted">Công việc</p>
                            </div>
                        </div>
                    </div>
                ))}

                <Link href="/dashboard/team/new" className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer min-h-[200px] group">
                    <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
                    </div>
                    <h3 className="text-[#111418] dark:text-white text-base font-bold">Mời thành viên</h3>
                    <p className="text-sm text-[#617589] dark:text-slate-400 mt-1">Thêm người mới vào đội ngũ</p>
                </Link>
            </div>
        </div>
    );
}
