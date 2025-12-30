
import React from 'react';

interface LandingProps {
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden">
      {/* Navbar */}
      {/* Fixed: Use className instead of class */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#f0f2f4] dark:border-gray-800 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">deployed_code</span>
              </div>
              <h2 className="text-text-main dark:text-white text-xl font-bold tracking-tight">PMP Master</h2>
            </div>
            <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
              <div className="flex items-center gap-6">
                <a className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">Tính năng</a>
                <a className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">Bảng giá</a>
                <a className="text-text-main dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">Giới thiệu</a>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onLogin} className="text-text-main dark:text-white text-sm font-bold hover:text-primary transition-colors">Đăng nhập</button>
                <button onClick={onLogin} className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors">
                  <span className="truncate">Bắt đầu ngay</span>
                </button>
              </div>
            </div>
            <div className="flex md:hidden">
              <button className="text-text-main dark:text-white">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      {/* Fixed: Use className instead of class */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="layout-container flex flex-col justify-center py-10 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
              <div className="flex flex-col gap-4">
                <h1 className="text-text-main dark:text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                  Quản Lý Dự Án <br className="hidden lg:block"/> <span className="text-primary">Một Cách Chính Xác.</span>
                </h1>
                <h2 className="text-text-muted dark:text-gray-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Giải pháp PMP toàn diện để theo dõi cột mốc, quản lý nguồn lực và giao kết quả đúng hạn. Tham gia cùng hơn 10,000 quản lý dự án ngay hôm nay.
                </h2>
              </div>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                {['Không cần thẻ tín dụng', 'Dùng thử miễn phí 14 ngày', 'Hủy bất kỳ lúc nào'].map(text => (
                  <div key={text} className="flex items-center gap-2 text-sm font-medium text-text-main dark:text-gray-300">
                    <span className="material-symbols-outlined text-green-500 filled text-[20px]">check_circle</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-8 opacity-70 grayscale">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Được tin dùng bởi các đội ngũ hiện đại</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-8 items-center">
                  {['ACME Corp', 'GlobalTech', 'Nebula', 'FoxRun'].map(brand => (
                    <span key={brand} className="text-xl font-bold text-gray-400 font-display">{brand}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 w-full max-w-md mx-auto">
              <div className="bg-card-light dark:bg-card-dark rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-text-main dark:text-white">Đăng Ký Miễn Phí</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-text-muted">Hoặc</span>
                    <button onClick={onLogin} className="text-sm font-bold text-primary hover:underline">Đăng Nhập</button>
                  </div>
                </div>
                <form action="#" className="flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-text-main dark:text-gray-300">Email Công Việc</span>
                    <input className="h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="ten@congty.com" type="email"/>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-text-main dark:text-gray-300">Mật Khẩu</span>
                    <input className="h-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow" placeholder="Tạo mật khẩu" type="password"/>
                  </label>
                  <button onClick={onLogin} className="mt-2 h-11 w-full rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all" type="button">
                    Tạo Tài Khoản
                  </button>
                </form>
                <p className="mt-4 text-xs text-center text-text-muted">
                  Bằng cách đăng ký, bạn đồng ý với <a className="underline hover:text-text-main" href="#">Điều khoản</a> và <a className="underline hover:text-text-main" href="#">Chính sách bảo mật</a> của chúng tôi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-white dark:bg-background-dark py-16 lg:py-24">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-text-main dark:text-white text-3xl sm:text-4xl font-black mb-4">
              Tính Năng Mạnh Mẽ Cho Đội Ngũ Hiện Đại
            </h2>
            <p className="text-text-muted dark:text-gray-400 text-lg">
              Mọi thứ bạn cần để bàn giao dự án đúng hạn và trong ngân sách.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon="groups" title="Hợp Tác Thời Gian Thực" desc="Làm việc liền mạch cùng đội ngũ của bạn, bất kể họ ở đâu." />
            <FeatureCard icon="bar_chart" title="Phân Tích Nâng Cao" desc="Có được cái nhìn sâu sắc về hiệu suất dự án với báo cáo tự động." />
            <FeatureCard icon="sync_alt" title="Agile & Waterfall" desc="Quản lý dự án linh hoạt theo phương pháp ưa thích của bạn." />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
  /* Fixed: Use className instead of class */
  <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-background-light dark:bg-card-dark p-6 hover:shadow-lg transition-shadow">
    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary mb-2">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-text-main dark:text-white text-lg font-bold mb-2">{title}</h3>
      <p className="text-text-muted dark:text-gray-400 text-sm">{desc}</p>
    </div>
  </div>
);

export default Landing;
