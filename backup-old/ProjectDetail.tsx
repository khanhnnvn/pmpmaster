
import React, { useState } from 'react';
import MeetingMinutes from './MeetingMinutes';

const ProjectDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'meetings'>('tasks');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
            <span>Dự án</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-bold text-text-main dark:text-white">Phát triển Website TMĐT</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#111418] dark:text-white tracking-tight">Phát triển Website Thương mại Điện tử</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-lg bg-white dark:bg-[#2a3642] border border-[#dbe0e6] dark:border-gray-600 text-[#111418] dark:text-white text-sm font-bold flex items-center gap-2 hover:bg-gray-50">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Mời thành viên
          </button>
          <button className="h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-bold flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[20px]">add_task</span>
            Thêm công việc
          </button>
        </div>
      </div>

      <div className="border-b border-[#dbe0e6] dark:border-gray-700">
        <div className="flex gap-4">
          <TabButton 
            active={activeTab === 'tasks'} 
            onClick={() => setActiveTab('tasks')} 
            label="Danh sách công việc" 
          />
          <TabButton 
            active={activeTab === 'meetings'} 
            onClick={() => setActiveTab('meetings')} 
            label="Biên bản họp" 
            badge="Mới" 
          />
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-[#f0f2f4] dark:border-gray-700 flex flex-col">
          <div className="px-6 py-5 border-b border-[#f0f2f4] dark:border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">list_alt</span>
              <h3 className="font-bold text-lg">Danh sách công việc</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 text-text-muted text-xs uppercase font-semibold">
                  <th className="px-6 py-4">Tên công việc</th>
                  <th className="px-6 py-4">Người phụ trách</th>
                  <th className="px-6 py-4 text-right">Hạn hoàn thành</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <TaskRow title="Thiết kế Homepage" code="#1024" user="Trần B" date="15/10/2023" timeRemain="Còn 2 ngày" />
                <TaskRow title="Viết API thanh toán" code="#1025" user="Lê C" date="18/10/2023" />
                <TaskRow title="Kiểm thử giỏ hàng" code="#1028" user="Nguyễn A" date="20/10/2023" />
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button className="text-sm font-medium text-slate-500 hover:text-primary">Hiển thị thêm</button>
          </div>
        </div>
      ) : (
        <MeetingMinutes />
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label, badge }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 pb-3 pt-2 font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 border-b-[3px] ${
      active ? 'border-primary text-text-main dark:text-white' : 'border-transparent text-text-muted hover:text-text-main'
    }`}
  >
    {label}
    {badge && <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>}
  </button>
);

const TaskRow = ({ title, code, user, date, timeRemain }: any) => (
  <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
    <td className="px-6 py-4">
      <div className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">{title}</div>
      <div className="text-xs text-text-muted">Mã CV: {code}</div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <img src={`https://picsum.photos/id/${Math.floor(Math.random() * 50)}/32/32`} className="w-7 h-7 rounded-full object-cover" />
        <span className="text-sm">{user}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <div className="font-medium">{date}</div>
      {timeRemain && <div className="text-xs text-orange-500 font-medium">{timeRemain}</div>}
    </td>
  </tr>
);

export default ProjectDetail;
