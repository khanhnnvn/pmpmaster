
import React, { useState } from 'react';
import { MeetingMinute } from '../types';

const MOCK_MEETINGS: MeetingMinute[] = [
  {
    id: '1',
    title: 'Họp tuần - Sprint 4',
    date: '25',
    month: 'Th.10',
    time: '10:00 - 11:00',
    attendees: ['Alex Johnson', 'Jane Doe', 'Mike T.'],
    notes: 'Đội frontend báo cáo trễ 2 ngày do vấn đề tích hợp API. Đội backend đã giải quyết xong các lỗi endpoint vào sáng nay. Chúng ta cần cập nhật lại tiến độ.',
    actions: [
      { id: 'a1', text: 'Cập nhật Biểu đồ Gantt', assignee: 'Sarah J.', linked: true },
      { id: 'a2', text: 'Đặt mua phần cứng', assignee: 'Mike T.' }
    ]
  },
  {
    id: '2',
    title: 'Đánh giá rủi ro',
    date: '19',
    month: 'Th.10',
    time: '14:30 - 15:30',
    attendees: ['Alex Johnson', 'Jane Doe'],
    notes: 'Phân tích các rủi ro tiềm ẩn khi mở rộng quy mô server. Cần xem xét nhà cung cấp dự phòng.',
    actions: [
      { id: 'a3', text: 'Liên hệ AWS Support', assignee: 'Jane Doe' }
    ]
  },
  {
    id: '3',
    title: 'Họp khởi động',
    date: '12',
    month: 'Th.10',
    time: '09:00 - 10:30',
    attendees: ['Alex Johnson', 'Client A'],
    notes: 'Xác định phạm vi dự án và các mốc thời gian quan trọng. Khách hàng yêu cầu ưu tiên tính năng thanh toán.',
    actions: [
      { id: 'a4', text: 'Gửi biên bản họp cho khách', assignee: 'Alex Johnson', linked: true }
    ]
  }
];

const MeetingMinutes: React.FC = () => {
  const [selectedId, setSelectedId] = useState(MOCK_MEETINGS[0].id);
  const activeMeeting = MOCK_MEETINGS.find(m => m.id === selectedId) || MOCK_MEETINGS[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[500px]">
      {/* List Panel */}
      <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-gray-800">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-[#111418] dark:text-white" 
              placeholder="Tìm kiếm cuộc họp..." 
              type="text"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_MEETINGS.map(meeting => (
            <MeetingItem 
              key={meeting.id}
              active={selectedId === meeting.id} 
              onClick={() => setSelectedId(meeting.id)}
              title={meeting.title} 
              date={meeting.date} 
              month={meeting.month} 
              desc={meeting.notes} 
            />
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-card-dark rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-gray-800">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tiêu đề cuộc họp</label>
              <h1 className="text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 text-[#111418] dark:text-white">
                {activeMeeting.title}
              </h1>
            </div>
            <div className="flex -space-x-2">
              {activeMeeting.attendees.map((name, i) => (
                <div key={name} className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-800 bg-primary/20 flex items-center justify-center text-[10px] font-bold overflow-hidden">
                  <img className="h-full w-full object-cover" src={`https://picsum.photos/id/${i + 25}/32/32`} alt={name} />
                </div>
              ))}
              <button className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 ring-2 ring-white flex items-center justify-center text-xs font-medium text-slate-500">+1</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            <Badge icon="calendar_today" text={`${activeMeeting.date} ${activeMeeting.month}, 2023 • ${activeMeeting.time}`} />
            <Badge icon="videocam" text="Link Zoom" isLink />
            <Badge icon="person" text={`Chủ trì bởi ${activeMeeting.attendees[0]}`} />
          </div>
        </div>
        
        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">description</span>
              Ghi chú cuộc họp
            </h2>
            <div className="min-h-[150px] border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {activeMeeting.notes}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">task_alt</span>
                Hạng mục công việc
              </h2>
              <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">add</span> Thêm mục
              </button>
            </div>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Hạng mục</th>
                    <th className="px-4 py-3">Người thực hiện</th>
                    <th className="px-4 py-3 text-center">Tác vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeMeeting.actions.map(action => (
                    <ActionItem key={action.id} text={action.text} user={action.assignee} linked={action.linked} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const MeetingItem = ({ active, date, month, title, desc, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
      active ? 'bg-primary/5 border-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent'
    }`}
  >
    <div className={`flex flex-col items-center justify-center rounded-md h-12 w-12 shrink-0 border ${
      active ? 'bg-white dark:bg-slate-800 border-slate-100' : 'bg-slate-100 dark:bg-slate-800 border-transparent'
    }`}>
      <span className={`text-[10px] font-bold uppercase ${active ? 'text-primary' : 'text-slate-500'}`}>{month}</span>
      <span className={`text-lg font-bold ${active ? 'text-primary' : ''}`}>{date}</span>
    </div>
    <div className="flex flex-col min-w-0 flex-1">
      <h3 className={`text-sm truncate ${active ? 'text-primary font-bold' : 'font-medium text-[#111418] dark:text-white'}`}>{title}</h3>
      <p className="text-xs text-slate-500 truncate">{desc}</p>
    </div>
    {active && <span className="material-symbols-outlined text-primary text-sm shrink-0">arrow_forward_ios</span>}
  </div>
);

const Badge = ({ icon, text, isLink }: any) => (
  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-md">
    <span className="material-symbols-outlined text-[18px] text-slate-400">{icon}</span>
    {isLink ? <a href="#" className="text-primary hover:underline font-medium">{text}</a> : <span className="font-medium">{text}</span>}
  </div>
);

const ActionItem = ({ text, user, linked }: any) => (
  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <td className="px-4 py-3 font-medium text-[#111418] dark:text-white">{text}</td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
          <img src="https://picsum.photos/id/10/24/24" className="w-full h-full object-cover" />
        </div>
        <span className="text-slate-600 dark:text-slate-300">{user}</span>
      </div>
    </td>
    <td className="px-4 py-3 text-center">
      {linked ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
          <span className="material-symbols-outlined text-[16px] filled">link</span>
          Đã liên kết
        </span>
      ) : (
        <button className="text-xs text-slate-500 border border-dashed border-slate-300 dark:border-slate-600 rounded px-2 py-1 hover:border-primary hover:text-primary transition-colors">Tạo công việc</button>
      )}
    </td>
  </tr>
);

export default MeetingMinutes;
