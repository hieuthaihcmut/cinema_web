# 🎬 Cinema Web – Fullstack Movie Management Website

Cinema Web là ứng dụng web fullstack được xây dựng bằng **Node.js + Express (Backend)** và **React + Vite (Frontend)**.  
Ứng dụng hỗ trợ xem danh sách phim, rạp chiếu và lịch chiếu theo thời gian thực từ cơ sở dữ liệu SQL Server.

---

## 📌 1. Tính năng chính

### 🎥 Frontend (React + Vite)
- Hiển thị danh sách phim
- Xem danh sách rạp chiếu
- Xem lịch chiếu
- UI chia page: Home, Movies, Cinemas, Showtimes
- Kết nối API backend bằng Axios
- Build nhanh với Vite

### 🛠 Backend (Node.js + Express)
- REST API: `/movies`, `/cinemas`, `/showtimes`
- Sử dụng SQL Server (mssql)
- Chia router rõ ràng
- Hỗ trợ `.env` để ẩn thông tin database
- Cho phép frontend truy cập thông qua CORS

---

## 📂 2. Cấu trúc thư mục

