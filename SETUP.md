# Hướng dẫn Cài đặt PMP Master trên Ubuntu 24.04 LTS

## Yêu cầu hệ thống

- Ubuntu 24.04 LTS
- Node.js 20.x LTS trở lên
- PostgreSQL 16.x
- Git

## 1. Cài đặt Node.js

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt curl nếu chưa có
sudo apt install -y curl

# Thêm NodeSource repository cho Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Cài đặt Node.js
sudo apt install -y nodejs

# Kiểm tra phiên bản
node --version  # v20.x.x
npm --version   # 10.x.x
```

## 2. Cài đặt PostgreSQL (Tùy chọn - nếu chưa có server)

```bash
# Cài đặt PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Khởi động và kích hoạt PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Đặt mật khẩu cho user postgres
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'moitinhdau';"

# Cho phép kết nối từ xa (nếu cần)
# Sửa file /etc/postgresql/16/main/postgresql.conf
# listen_addresses = '*'

# Sửa file /etc/postgresql/16/main/pg_hba.conf
# Thêm dòng: host all all 0.0.0.0/0 md5

# Khởi động lại PostgreSQL
sudo systemctl restart postgresql
```

## 3. Clone và cài đặt dự án

```bash
# Clone dự án
git clone <repository-url> pmp-master
cd pmp-master

# Cài đặt dependencies
npm install
```

## 4. Cấu hình môi trường

Copy file `.env.example` thành `.env.local` và chỉnh sửa các giá trị:

```bash
# Copy file template
cp .env.example .env.local

# Chỉnh sửa cấu hình
nano .env.local
```

Nội dung file `.env.local`:

```env
# Database Configuration
DB_HOST=100.67.197.73
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=moitinhdau
DB_NAME=pmp_app

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# NextAuth (if needed)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## 5. Khởi tạo Database

```bash
# Tạo database và các bảng
node scripts/init-db.js

# Thêm dữ liệu mẫu (tùy chọn)
node scripts/seed-db.js
```

## 6. Chạy ứng dụng

### Development mode:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Production mode:
```bash
# Build ứng dụng
npm run build

# Chạy production server
npm start
```

## 7. Cấu hình Nginx (Production)

```bash
# Cài đặt Nginx
sudo apt install -y nginx

# Tạo file cấu hình
sudo nano /etc/nginx/sites-available/pmp-master
```

Nội dung file cấu hình:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Kích hoạt site
sudo ln -s /etc/nginx/sites-available/pmp-master /etc/nginx/sites-enabled/

# Kiểm tra cấu hình
sudo nginx -t

# Khởi động lại Nginx
sudo systemctl restart nginx
```

## 8. Cấu hình PM2 (Process Manager)

```bash
# Cài đặt PM2
sudo npm install -g pm2

# Chạy ứng dụng với PM2
pm2 start npm --name "pmp-master" -- start

# Lưu cấu hình PM2
pm2 save

# Tự động khởi động khi reboot
pm2 startup
```

## 9. Cấu hình SSL với Let's Encrypt (Tùy chọn)

```bash
# Cài đặt Certbot
sudo apt install -y certbot python3-certbot-nginx

# Lấy SSL certificate
sudo certbot --nginx -d your-domain.com

# Tự động gia hạn
sudo systemctl enable certbot.timer
```

## Các tài khoản mặc định (sau khi seed)

| Email | Mật khẩu | Vai trò |
|-------|----------|---------|
| alex@pmpmaster.com | password123 | Admin |
| sarah@pmpmaster.com | password123 | User |
| mike@pmpmaster.com | password123 | User |
| emily@pmpmaster.com | password123 | User |
| david@pmpmaster.com | password123 | User |

## Cấu trúc thư mục

```
pmp-master/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Landing page
│   │   ├── dashboard/       # Dashboard pages
│   │   └── api/             # API routes
│   ├── components/          # React components
│   ├── lib/                 # Utilities (db, auth)
│   └── types/               # TypeScript types
├── scripts/
│   ├── init-db.js           # Database initialization
│   └── seed-db.js           # Sample data seeding
├── public/                  # Static files
└── package.json
```

## Khắc phục sự cố

### Lỗi kết nối database
```bash
# Kiểm tra PostgreSQL đang chạy
sudo systemctl status postgresql

# Kiểm tra cổng 5432
netstat -tlnp | grep 5432
```

### Lỗi build
```bash
# Xóa cache và build lại
rm -rf .next node_modules
npm install
npm run build
```

### Xem logs
```bash
# PM2 logs
pm2 logs pmp-master

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên repository hoặc liên hệ đội phát triển.
