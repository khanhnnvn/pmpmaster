export default function ReportsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[#111418] dark:text-white text-3xl font-black">Báo cáo & Phân tích</h1>
                    <p className="text-[#617589] dark:text-slate-400 text-sm">Xem thống kê và phân tích hiệu suất dự án.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 h-11 shadow-sm transition-all">
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span className="text-sm font-bold">Xuất báo cáo</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-primary">trending_up</span>
                        </div>
                        <span className="text-sm font-medium text-slate-500">Tiến độ trung bình</span>
                    </div>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">67%</p>
                    <p className="text-sm text-emerald-600 mt-1">+5% so với tuần trước</p>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                        </div>
                        <span className="text-sm font-medium text-slate-500">Công việc hoàn thành</span>
                    </div>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">89</p>
                    <p className="text-sm text-emerald-600 mt-1">+12 tuần này</p>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-orange-600">schedule</span>
                        </div>
                        <span className="text-sm font-medium text-slate-500">Giờ làm việc</span>
                    </div>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">1,245</p>
                    <p className="text-sm text-slate-500 mt-1">Tháng này</p>
                </div>

                <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600">groups</span>
                        </div>
                        <span className="text-sm font-medium text-slate-500">Hiệu suất đội</span>
                    </div>
                    <p className="text-3xl font-bold text-[#111418] dark:text-white">94%</p>
                    <p className="text-sm text-emerald-600 mt-1">Xuất sắc</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-6">Tiến độ dự án</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Website TMĐT', progress: 75, color: 'bg-primary' },
                            { name: 'Ứng dụng V2.0', progress: 45, color: 'bg-yellow-500' },
                            { name: 'Marketing Q3', progress: 90, color: 'bg-emerald-500' },
                            { name: 'Cloud Migration', progress: 60, color: 'bg-purple-500' },
                        ].map((project) => (
                            <div key={project.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-[#111418] dark:text-white">{project.name}</span>
                                    <span className="text-sm font-bold text-slate-500">{project.progress}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full ${project.color} rounded-full`} style={{ width: `${project.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-6">Phân bố công việc</h3>
                    <div className="flex items-center justify-center h-[200px]">
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full border-8 border-primary mx-auto mb-4 flex items-center justify-center">
                                <div>
                                    <p className="text-3xl font-bold text-[#111418] dark:text-white">124</p>
                                    <p className="text-xs text-slate-500">Tổng công việc</p>
                                </div>
                            </div>
                            <div className="flex gap-4 justify-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span>Hoàn thành: 89</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span>Đang làm: 32</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Quá hạn: 3</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
