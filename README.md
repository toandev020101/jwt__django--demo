# jwt__django--demo

- Các chức năng chính:
    + Đăng nhập
    + Đăng ký
    + Xác minh email (otp)
    + Quên mật khẩu (liên kết)
    + Xem, cập nhật thông tin tài khoản
    + Đăng xuất
- Công nghệ:
    + ReactJS (frontend)
    + Django + Django rest framework (backend)
    + Axios (call api)
    + JWT (authentication)
    + PostgresSQL (database)
- Cài đặt:
    + Tải file zip hoặc clone về máy
    + Mở project và cấu hình file .env từ file .env.example ở server
    + Chạy project:
        * Mở terminal -> cd client -> npm i -> npm start
        * Mở thêm một terminal mới -> cd server -> python -m venv venv ("python -m venv venv" nếu là linux)
          -> venv\Scripts\activate.bat ("source venv/bin/activate" nếu là linux") -> pip install -r requirements.txt -v
          -> python manage.py runserver -> python manage.py createsuperuser