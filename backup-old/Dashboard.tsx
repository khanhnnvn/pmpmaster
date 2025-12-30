
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#111418] dark:text-white tracking-tight">Tổng Quan Bảng Điều Khiển</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Chào buổi sáng, Alex. Dưới đây là tình hình các dự án của bạn hôm nay.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white dark:bg-card-dark px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>Hôm nay, 24 Th10</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng số dự án" value="14" trend="+2 đang chạy" icon="work" color="text-primary" />
        <StatCard title="Công việc chờ xử lý" value="124" trend="12 đến hạn hôm nay" icon="check_circle" color="text-primary" />
        <StatCard title="Công việc quá hạn" value="3" trend="Cần chú ý" icon="warning" color="text-red-500" isWarning />
        <StatCard title="Hiệu suất đội ngũ" value="94%" trend="+12% tuần này" icon="bolt" color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#111418] dark:text-white">Công việc cập nhật gần đây</h3>
            <button className="text-sm font-bold text-primary hover:text-primary/80">Xem tất cả</button>
          </div>
          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-gray-800/50">
                    <th className="p-4 font-semibold">Tên công việc</th>
                    <th className="p-4 font-semibold">Dự án</th>
                    <th className="p-4 font-semibold">Trạng thái</th>
                    <th className="p-4 font-semibold text-right">Hạn chót</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <TableRow title="Thiết kế lại trang chủ" project="Cải tiến Website" status="Đang thực hiện" statusColor="blue" date="26 Th10" />
                  <TableRow title="Báo cáo tài chính Q3" project="Kiểm toán tài chính" status="Đang duyệt" statusColor="yellow" date="28 Th10" />
                  <TableRow title="Tích hợp API" project="Ứng dụng V2.0" status="Quá hạn" statusColor="red" date="22 Th10" isCritical />
                  <TableRow title="Họp khách hàng" project="Marketing Strategy" status="Hoàn thành" statusColor="emerald" date="Hôm nay" />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[#111418] dark:text-white">Sức khỏe dự án</h3>
          <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-gray-800 p-6 flex flex-col gap-6 shadow-sm">
            <HealthItem title="Cải tiến Website" percent={75} color="bg-primary" status="Đúng tiến độ" />
            <div className="h-px bg-slate-100 dark:bg-gray-800"></div>
            <HealthItem title="Ứng dụng V2.0" percent={45} color="bg-yellow-500" status="Rủi ro: Trễ API" />
            <div className="h-px bg-slate-100 dark:bg-gray-800"></div>
            <HealthItem title="Marketing Q3" percent={90} color="bg-emerald-500" status="Sắp hoàn thành" />
            
            <div className="mt-2 pt-4 border-t border-slate-100 dark:border-gray-800">
              <button className="w-full py-2 text-sm font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">Xem tất cả dự án</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon, color, isWarning = false }: any) => (
  <div className={`bg-white dark:bg-card-dark p-6 rounded-xl border ${isWarning ? 'border-red-100 dark:border-red-900/30' : 'border-slate-100 dark:border-gray-800'} shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group`}>
    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className={`material-symbols-outlined text-6xl ${color}`}>{icon}</span>
    </div>
    <div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-[#111418] dark:text-white mt-1">{value}</h3>
    </div>
    <div className={`flex items-center gap-1 text-sm font-medium ${isWarning ? 'text-red-600' : 'text-emerald-600'}`}>
      <span className="material-symbols-outlined text-[16px]">{isWarning ? 'priority_high' : 'trending_up'}</span>
      <span>{trend}</span>
    </div>
  </div>
);

const TableRow = ({ title, project, status, statusColor, date, isCritical = false }: any) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return (
    <tr className="border-b border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="p-4 font-medium text-[#111418] dark:text-white">{title}</td>
      <td className="p-4 text-slate-500 dark:text-slate-400">{project}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colors[statusColor]}`}>
          {status}
        </span>
      </td>
      <td className={`p-4 text-right ${isCritical ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>{date}</td>
    </tr>
  );
};

const HealthItem = ({ title, percent, color, status }: any) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-3">
        <div className={`size-2 rounded-full ${color}`}></div>
        <span className="font-bold text-sm text-[#111418] dark:text-white">{title}</span>
      </div>
      <span className="text-xs font-medium text-slate-500">{percent}%</span>
    </div>
    <div className="h-2 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }}></div>
    </div>
    <p className="text-xs text-slate-400 mt-1">{status}</p>
  </div>
);

export default Dashboard;
