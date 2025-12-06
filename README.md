# 🎬 Cinema Web — Fullstack Movie Management

Ứng dụng web fullstack gồm **Backend (Node.js + Express + SQL Server)** và **Frontend (React + Vite)** để xem danh sách phim, rạp chiếu, và lịch chiếu.

---

## 🚀 Tính năng
- Frontend: Home, Movies, Cinemas, Showtimes; gọi API qua proxy Vite.
- Backend: REST API `/movies`, `/cinemas`, `/showtimes` với CORS.
- Database: SQL Server, kết nối qua `mssql/tedious`.
- Cấu hình `.env`, chuẩn hoá line-endings, `.gitignore` sẵn.

---

## 🧰 Công cụ/Thư viện
- Backend: `express`, `cors`, `mssql`, `dotenv`, `ejs` (mẫu MVC).
- Frontend: `react`, `react-dom`, `react-router-dom`, `vite`, `@vitejs/plugin-react`.
- Git: `.gitignore`, `.gitattributes` (chuẩn hoá CRLF/LF).

---

## 📂 Cấu trúc
```
cinema_web/
├─ backend/
│  ├─ server.js
│  ├─ routes/
│  │  ├─ cinemas.js
│  │  ├─ movies.js
│  │  └─ showtimes.js
│  └─ package.json
├─ frontend/
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  └─ src/
│     ├─ api.js
│     ├─ main.jsx
│     └─ pages/
│        ├─ Home.jsx
│        ├─ Cinemas.jsx
│        ├─ Movies.jsx
│        └─ Showtimes.jsx
├─ .env
├─ .gitignore
├─ .gitattributes
└─ README.md
```

---

## ⚙️ Cài đặt
Yêu cầu: `Node.js ≥ 18`, `npm`, SQL Server (local `SQLEXPRESS` hoặc máy chủ khác).

### 1) Cài dependencies
```powershell
cd "C:\Users\ASUS\OneDrive\Desktop\cinema_web"
# Frontend
cd frontend; npm install; cd ..
# Backend
cd backend; npm install; cd ..
```

### 2) Tạo `.env` (ở thư mục gốc)
```env
PORT=3000
DB_SERVER=localhost
DB_INSTANCE=SQLEXPRESS
DB_NAME=Cinema
DB_USER=cinema_user
DB_PASSWORD=123
# Tuỳ chọn: DB_PORT=1434 (nếu đặt port cố định cho SQLEXPRESS)
```

Lưu ý cho named instance `SQLEXPRESS`:
- Bật services: `SQL Server (SQLEXPRESS)` và `SQL Server Browser`.
- Enable `TCP/IP` trong SQL Server Configuration Manager → Protocols for SQLEXPRESS.
- Có thể đặt TCP Port cố định (IPAll → TCP Port), sau đó dùng `DB_PORT`.

---

## ▶️ Chạy dự án
### Chạy Backend
```powershell
cd "C:\Users\ASUS\OneDrive\Desktop\cinema_web\backend"
node server.js
# Backend tại http://localhost:3000
```
Nếu thấy lỗi `ETIMEOUT` khi kết nối DB, kiểm tra services/TCP/IP/firewall hoặc dùng `DB_PORT` cố định.

### Chạy Frontend
```powershell
cd "C:\Users\ASUS\OneDrive\Desktop\cinema_web\frontend"
npm run dev
# Frontend tại http://localhost:5173
```
Frontend đã cấu hình proxy (`vite.config.js`) để gọi API `/cinemas`, `/movies`, `/showtimes` đến `http://localhost:3000`.

---

## 🔌 API nhanh
- `GET /cinemas` → danh sách rạp
- `GET /movies` → danh sách phim
- `GET /showtimes` → danh sách lịch chiếu, hỗ trợ `?cinemaId=ID`

---

## 🧪 Kiểm thử
- Backend: mở `http://localhost:3000/` nhận `{ message: 'Cinema backend OK' }`.
- Frontend: `http://localhost:5173` → dùng menu để mở các trang.

---

## 📦 Git & Push
### `.gitignore`
Bỏ qua:
- `.env`
- `node_modules/`
- `frontend/dist/`, `backend/dist/`
- logs (`npm-debug.log*`, ...)

### `.gitattributes`
Chuẩn hoá line-endings để tránh cảnh báo CRLF/LF. Có thể renormalize:
```powershell
cd "C:\Users\ASUS\OneDrive\Desktop\cinema_web"
git add --renormalize .
git commit -m "Normalize line endings"
```

### Push lên GitHub (repo đã có sẵn)
```powershell
cd "C:\Users\ASUS\OneDrive\Desktop\cinema_web"
git add .
git commit -m "Init frontend + backend"
git branch -M main
# Thay URL bằng repo của bạn
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

---

## ❓ Troubleshooting
- `ETIMEOUT` khi connect SQL: bật SQL Browser, TCP/IP, firewall; hoặc đặt `DB_PORT` cố định.
- Frontend không gọi được API: đảm bảo backend chạy `:3000`; sửa proxy nếu đổi port.
- CORS: đã bật `cors()`; nếu domain khác, cấu hình lại `origin`.
- 404 ở frontend: dùng `BrowserRouter`; chạy `npm run dev` đúng thư mục.

---

## 📄 License
Dùng cho mục đích học tập/demo.
