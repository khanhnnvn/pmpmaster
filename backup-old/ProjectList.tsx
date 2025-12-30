
import React from 'react';

interface ProjectListProps {
  onProjectClick: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onProjectClick }) => {
  const projects = [
    { name: 'Thiết kế lại Website - Q3', client: 'Acme Corp', progress: 45, status: 'Đang thực hiện', badge: 'bg-primary' },
    { name: 'Ra mắt ứng dụng di động', client: 'FinTech Sol.', progress: 15, status: 'Lập kế hoạch', badge: 'bg-orange-400' },
    { name: 'Kiểm toán Marketing Q2', client: 'Nội bộ', progress: 100, status: 'Hoàn thành', badge: 'bg-emerald-500' },
    { name: 'Chuyển đổi Cloud', client: 'Omega Inc', progress: 72, status: 'Đang thực hiện', badge: 'bg-primary' },
    { name: 'Làm mới thương hiệu', client: 'Startup X', progress: 0, status: 'Lập kế hoạch', badge: 'bg-orange-400' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#111418] dark:text-white text-3xl font-black">Dự án</h1>
          <p className="text-[#617589] dark:text-slate-400 text-sm">Quản lý và theo dõi tất cả các dự án đang triển khai.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white rounded-lg px-5 h-11 shadow-sm transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm font-bold">Tạo dự án</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p, idx) => (
          <div 
            key={idx} 
            onClick={onProjectClick}
            className="flex flex-col bg-white dark:bg-card-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group cursor-pointer relative"
          >
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-start">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white ${p.badge}`}>
                  {p.status}
                </span>
                <button className="text-slate-400 hover:text-slate-700">
                  <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                </button>
              </div>
              <div>
                <h3 className="text-[#111418] dark:text-white text-lg font-bold group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-sm text-[#617589] dark:text-slate-400">Khách hàng: {p.client}</p>
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
                <div className="flex -space-x-2">
                   {[1, 2].map(i => (
                     <img key={i} src={`https://picsum.photos/id/${idx + i + 10}/32/32`} className="w-8 h-8 rounded-full border-2 border-white dark:border-card-dark object-cover" />
                   ))}
                </div>
                <div className="flex items-center gap-1.5 text-[#617589] dark:text-slate-400">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  <span className="text-xs font-medium">24 Th10</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer min-h-[220px] group">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-3xl">add</span>
          </div>
          <h3 className="text-[#111418] dark:text-white text-lg font-bold">Dự án mới</h3>
          <p className="text-sm text-[#617589] dark:text-slate-400 mt-1">Bắt đầu dự án mới</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
