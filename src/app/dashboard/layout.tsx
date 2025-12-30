'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check for saved preference or system preference
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        // Clear any auth tokens
        localStorage.removeItem('token');
        // Redirect to home
        window.location.href = '/';
    };

    return (
        <div className="flex h-screen w-full bg-background-light dark:bg-background-dark overflow-hidden transition-colors duration-200">
            <Sidebar onLogout={handleLogout} />

            <div className="flex-1 flex flex-col h-full min-w-0">
                <Header
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                />

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto p-4 lg:p-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
