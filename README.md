# User Management - Expo Mobile App (Context API + DummyJSON)

Ứng dụng mẫu React Native / Expo sử dụng **React Context API** để quản lý trạng thái và lấy dữ liệu trực tiếp từ API [DummyJSON](https://dummyjson.com/). Code được cấu trúc tối giản, có chú thích chi tiết từng bước, phù hợp cho mục đích học tập.

---

## 💡 Cách Context API hoạt động trong dự án

Tất cả logic quản lý trạng thái và gọi API được tập trung trong [`src/contexts/AuthContext.tsx`](src/contexts/AuthContext.tsx) qua 6 bước cơ bản:

1. **`createContext`**: Khởi tạo context (`AuthContext`).
2. **`AuthProvider`**: Component bao bọc ứng dụng và nắm giữ state (`user`, `usersList`, `isLoading`, `error`).
3. **`login(username, password)`**: Gọi `POST https://dummyjson.com/auth/login`, nhận token và thông tin người dùng rồi lưu vào state `user`.
4. **`fetchUsers()`**: Gọi `GET https://dummyjson.com/users`, lấy danh sách người dùng từ DummyJSON và lưu vào state `usersList`.
5. **`logout()`**: Đặt lại các state về `null` để quay về màn hình đăng nhập.
6. **`useAuth()`**: Custom hook giúp các màn hình con (`LoginScreen`, `HomeScreen`) truy cập dữ liệu và các hàm một cách đơn giản:
   ```tsx
   const { user, login, logout, usersList, fetchUsers } = useAuth();
   ```

---

## 🔑 Tài khoản kiểm thử mẫu (DummyJSON)

Bạn có thể bấm trực tiếp vào các nút mẫu trên màn hình đăng nhập để tự động điền:

| Tên | Username | Password |
|---|---|---|
| **Emily Johnson** | `emilys` | `emilyspass` |
| **Michael Williams** | `michaelw` | `michaelwpass` |

---

## 🚀 Hướng dẫn khởi chạy

1. Di chuyển vào thư mục:
```bash
cd user-management
```

2. Chạy máy chủ phát triển Expo:
```bash
npx expo start
```
* Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại.
* Hoặc bấm `w` để chạy thử nghiệm trên trình duyệt Web.

---

## 📁 Cấu trúc thư mục

```
user-management/
├── src/
│   ├── components/
│   │   ├── CustomInput.tsx       # Ô nhập liệu kèm icon & ẩn/hiện mật khẩu
│   │   └── CustomButton.tsx      # Nút bấm kèm hiệu ứng loading spinner
│   ├── contexts/
│   │   └── AuthContext.tsx       # Toàn bộ logic Context API + Gọi API DummyJSON
│   ├── screens/
│   │   ├── LoginScreen.tsx       # Màn hình đăng nhập gọi login() từ Context
│   │   └── HomeScreen.tsx        # Màn hình hồ sơ và danh sách users từ Context
│   ├── services/
│   │   └── authService.ts        # Helper gọi API DummyJSON
│   └── types/
│       └── auth.ts               # Interface TypeScript User & AuthContextType
├── App.tsx                       # Bao bọc App bằng AuthProvider và điều phối màn hình
├── package.json
└── tsconfig.json
```
