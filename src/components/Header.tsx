'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
    isDarkMode?: boolean;
    toggleDarkMode?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode = false, toggleDarkMode }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleToggleDarkMode = () => {
        if (toggleDarkMode) {
            toggleDarkMode();
        } else {
            document.documentElement.classList.toggle('dark');
        }
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 lg:px-10 bg-white dark:bg-card-dark border-b border-[#f0f2f4] dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-4 lg:hidden">
                <button className="text-[#111418] dark:text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="text-primary font-bold text-xl">PMP Master</div>
            </div>

            <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl">
                <label className="flex items-center w-full bg-background-light dark:bg-background-dark rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <span className="material-symbols-outlined text-slate-400">search</span>
                    <input
                        className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder-slate-400 text-[#111418] dark:text-white ml-2 outline-none"
                        placeholder="Tìm kiếm dự án, công việc hoặc thành viên..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </label>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleToggleDarkMode}
                    className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[#111418] dark:text-white"
                >
                    <span className="material-symbols-outlined">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[#111418] dark:text-white relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border border-white dark:border-card-dark"></span>
                </button>

                <Link
                    href="/dashboard/projects/new"
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary/30"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span className="hidden sm:inline">Dự án mới</span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
