# Thiết Kế Website

## Cấu trúc thư mục

- `FrontEnd/`: giao diện và các file HTML/JS phía client.
- `BackEnd/`: API/server Node.js (Express).
- `Images/`: tài nguyên ảnh.
- `.postman/`: cấu hình workspace Postman (nếu sử dụng).

## Chạy BackEnd

1. Vào thư mục backend:
   - `cd BackEnd`
2. Cài dependencies:
   - `npm install`
3. Tạo file môi trường từ mẫu:
   - sao chép `.env.example` thành `.env`
4. Chạy server:
   - `node server.js`

Server mặc định chạy ở `http://localhost:3000`.
