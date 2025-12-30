const IntegrationCard = ({ icon, iconBg, iconColor, title, desc, status, statusColor, btnLabel, primary }: {
    icon: string;
    iconBg: string;
    iconColor: string;
    title: string;
    desc: string;
    status: string;
    statusColor: string;
    btnLabel: string;
    primary?: boolean;
}) => (
    <div className={`flex flex-col justify-between gap-4 rounded-xl bg-white dark:bg-card-dark p-5 shadow-sm border ${primary ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark border-transparent' : 'border-slate-100 dark:border-gray-800'} transition-all hover:shadow-md`}>
        <div className="flex items-start justify-between">
            <div className={`p-3 rounded-lg ${iconBg}`}>
                <span className={`material-symbols-outlined text-3xl ${iconColor}`}>{icon}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                {status}
            </span>
        </div>
        <div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{desc}</p>
        </div>
        <button className={`w-full mt-2 cursor-pointer flex items-center justify-center rounded-lg h-10 px-4 font-medium transition-all ${primary ? 'bg-primary text-white hover:bg-primary-hover shadow-md shadow-blue-500/20' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}>
            {btnLabel}
        </button>
    </div>
);

const InputField = ({ label, type, value, placeholder, icon }: {
    label: string;
    type: string;
    value?: string;
    placeholder: string;
    icon: string;
}) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-muted">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <input
                className="block w-full pl-10 pr-10 rounded-lg border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-slate-800 text-sm h-11 focus:ring-primary focus:border-primary outline-none"
                type={type}
                defaultValue={value}
                placeholder={placeholder}
            />
        </div>
    </div>
);

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black">Cài đặt tích hợp</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
                    Quản lý kết nối của bạn với các dịch vụ thông báo bên ngoài. Định cấu hình khóa API và gán các kênh thông báo.
                </p>
            </div>

            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Các tích hợp có sẵn</h2>
                    <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Xem tài liệu <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <IntegrationCard
                        icon="smart_toy"
                        iconBg="bg-blue-50 dark:bg-blue-900/20"
                        iconColor="text-blue-500"
                        title="Telegram Bot"
                        desc="Kết nối bot tùy chỉnh của bạn để nhận cảnh báo tự động trực tiếp."
                        status="Đã kết nối"
                        statusColor="bg-green-100 text-green-700"
                        btnLabel="Cấu hình"
                    />
                    <IntegrationCard
                        icon="groups"
                        iconBg="bg-indigo-50 dark:bg-indigo-900/20"
                        iconColor="text-indigo-500"
                        title="Nhóm Telegram"
                        desc="Phát thông báo cập nhật dự án đến một chủ đề nhóm trò chuyện cụ thể."
                        status="Không hoạt động"
                        statusColor="bg-slate-100 text-slate-600"
                        btnLabel="Chỉnh sửa Cài đặt"
                        primary
                    />
                    <IntegrationCard
                        icon="mail"
                        iconBg="bg-orange-50 dark:bg-orange-900/20"
                        iconColor="text-orange-500"
                        title="Cổng Email"
                        desc="Cấu hình máy chủ SMTP để gửi thông báo email nhãn trắng cho khách hàng."
                        status="Không hoạt động"
                        statusColor="bg-slate-100 text-slate-600"
                        btnLabel="Kết nối"
                    />
                </div>
            </section>

            <section className="bg-white dark:bg-card-dark rounded-xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-gray-800 pb-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-indigo-500 text-2xl">groups</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Cấu hình nhóm Telegram</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Cập nhật thông tin xác thực và quản lý ánh xạ dự án.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Trạng thái</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700">
                            <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="font-bold">Thông tin xác thực</h3>
                        <div className="space-y-4">
                            <InputField label="Mã token API Bot" type="password" value="123456789:ABCdefGhIJKlmNoPQRstuVWxyz" placeholder="Bot API Key" icon="key" />
                            <InputField label="ID trò chuyện nhóm" type="text" placeholder="-100xxxxxxxxxx" icon="tag" />
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-all">Lưu thay đổi</button>
                            <button className="border border-slate-300 dark:border-gray-600 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-green-500 filled">check_circle</span>
                                Kiểm tra kết nối
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold">Liên kết dự án</h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden">
                            {['Thiết kế Website', 'Mobile App v2', 'Marketing Q3'].map((p, idx) => (
                                <label key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-gray-700 last:border-0 cursor-pointer">
                                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" defaultChecked={idx % 2 === 0} />
                                    <div>
                                        <p className="text-sm font-medium">{p}</p>
                                        <p className="text-xs text-slate-500">ID: #PROJ-{100 + idx}</p>
                                    </div>
                                </label>
                            ))}
                            <div className="bg-slate-100 dark:bg-slate-800 p-2 text-center">
                                <button className="text-xs font-medium text-primary hover:underline">Xem tất cả dự án</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
