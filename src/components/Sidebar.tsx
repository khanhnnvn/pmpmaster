'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const pathname = usePathname();

    const menuItems = [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: 'dashboard', href: '/dashboard' },
        { id: 'projects', label: 'Dự án', icon: 'work', href: '/dashboard/projects' },
        { id: 'tasks', label: 'Công việc', icon: 'check_box', href: '/dashboard/tasks' },
        { id: 'team', label: 'Đội ngũ', icon: 'group', href: '/dashboard/team' },
        { id: 'reports', label: 'Báo cáo', icon: 'bar_chart', href: '/dashboard/reports' },
    ];

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-[280px] h-full hidden lg:flex flex-col bg-white dark:bg-card-dark border-r border-[#f0f2f4] dark:border-gray-800 shrink-0">
            <div className="p-6 pb-2">
                <div className="flex gap-3 items-center mb-8">
                    <div className="bg-center bg-no-repeat bg-cover rounded-lg size-10 bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">token</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold leading-tight tracking-tight">PMP Master</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Quản lý chuyên nghiệp</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${isActive(item.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-[#111418] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[24px] ${isActive(item.href) ? 'filled' : ''}`}>
                                {item.icon}
                            </span>
                            <p className={`text-sm leading-normal ${isActive(item.href) ? 'font-bold' : 'font-medium'}`}>
                                {item.label}
                            </p>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 flex flex-col gap-4">
                <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${pathname === '/dashboard/settings'
                            ? 'bg-primary/10 text-primary'
                            : 'text-[#111418] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                >
                    <span className="material-symbols-outlined text-[24px]">settings</span>
                    <p className="text-sm font-medium leading-normal">Cài đặt</p>
                </Link>

                <div className="border-t border-[#f0f2f4] dark:border-gray-800 pt-4">
                    <div className="flex gap-3 items-center">
                        <img
                            src="https://picsum.photos/id/64/100/100"
                            className="rounded-full size-10 border-2 border-white dark:border-gray-700 shadow-sm object-cover"
                            alt="User"
                        />
                        <div className="flex flex-col flex-1">
                            <p className="text-sm font-bold text-[#111418] dark:text-white">Alex Johnson</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Trưởng dự án</p>
                        </div>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="text-slate-400 hover:text-red-500 transition-colors"
                                title="Đăng xuất"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
