# PMP Master

Hệ thống quản lý dự án chuyên nghiệp - Project Management Professional

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## Tính năng

- 📊 **Dashboard** - Tổng quan dự án, công việc và hiệu suất đội ngũ
- 📁 **Quản lý dự án** - Tạo, theo dõi tiến độ và quản lý thành viên
- ✅ **Quản lý công việc** - Phân công, theo dõi trạng thái và deadline
- 👥 **Quản lý đội ngũ** - Thêm thành viên và phân quyền
- 📝 **Biên bản họp** - Ghi chép và theo dõi action items
- 📈 **Báo cáo** - Phân tích hiệu suất dự án
- 🔗 **Tích hợp** - Telegram Bot, Email Gateway

## Công nghệ

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Authentication**: JWT + Cookie-based sessions

## Cài đặt nhanh

```bash
# Clone project
git clone <repository-url>
cd pmp-master

# Cài đặt dependencies
npm install

# Cấu hình môi trường
cp .env.example .env.local
# Chỉnh sửa .env.local với thông tin database của bạn

# Khởi tạo database
node scripts/init-db.js

# Thêm dữ liệu mẫu (tùy chọn)
node scripts/seed-db.js

# Chạy development server
npm run dev
```

Truy cập: http://localhost:3000

## Cấu hình môi trường

Tạo file `.env.local` từ template:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=pmp_app

# JWT
JWT_SECRET=your-jwt-secret

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Tài khoản demo

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| alex@pmpmaster.com | password123 | Admin |
| sarah@pmpmaster.com | password123 | User |

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Run ESLint
```

## Cấu trúc thư mục

```
pmp-master/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API endpoints
│   │   ├── dashboard/    # Dashboard pages
│   │   ├── login/        # Auth pages
│   │   └── page.tsx      # Landing page
│   ├── components/       # React components
│   ├── lib/              # Utilities (db, auth)
│   └── types/            # TypeScript types
├── scripts/              # Database scripts
├── .env.example          # Environment template
└── SETUP.md              # Hướng dẫn chi tiết Ubuntu
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/register` | Đăng ký |
| GET | `/api/dashboard` | Thống kê tổng quan |
| GET/POST | `/api/projects` | CRUD dự án |
| GET/POST | `/api/tasks` | CRUD công việc |
| GET/POST | `/api/team` | CRUD thành viên |
| GET/POST | `/api/meetings` | CRUD cuộc họp |

## Deploy

Xem hướng dẫn chi tiết tại [SETUP.md](./SETUP.md) cho Ubuntu 24.04 LTS.

## License

MIT
