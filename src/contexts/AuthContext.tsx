import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

// =========================================================================
// BƯỚC 1: Khởi tạo Context với giá trị mặc định là undefined
// =========================================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =========================================================================
// BƯỚC 2: Tạo Provider để bao bọc các component con và cung cấp dữ liệu
// =========================================================================
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Quản lý state toàn cục bằng useState đơn giản
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // =======================================================================
  // BƯỚC 3: Hàm đăng nhập - Lấy dữ liệu từ DummyJSON (POST /auth/login)
  // =======================================================================
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Gọi trực tiếp fetch tới API DummyJSON
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          expiresInMins: 60,
        }),
      });

      const data = await response.json();

      // Nếu API trả về lỗi (ví dụ: Invalid credentials)
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập không thành công!');
      }

      // Đăng nhập thành công -> lưu thông tin user vào State
      const loggedInUser: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
        token: data.accessToken,
      };

      setUser(loggedInUser);
      return true;
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // =======================================================================
  // BƯỚC 4: Hàm lấy danh sách người dùng từ DummyJSON (GET /users)
  // =======================================================================
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://dummyjson.com/users?limit=8', {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const data = await response.json();

      if (response.ok && data.users) {
        setUsersList(data.users);
      } else {
        throw new Error('Không thể tải danh sách người dùng');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách người dùng.');
    } finally {
      setIsLoading(false);
    }
  };

  // =======================================================================
  // BƯỚC 5: Hàm đăng xuất - Đặt lại trạng thái về ban đầu
  // =======================================================================
  const logout = () => {
    setUser(null);
    setUsersList([]);
    setError(null);
  };

  // Cung cấp các giá trị và hàm cho toàn bộ ứng dụng thông qua Provider
  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        isLoading,
        error,
        login,
        logout,
        fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================================
// BƯỚC 6: Custom Hook useAuth() giúp các component con dùng Context dễ dàng
// Cách dùng trong component: const { user, login, logout } = useAuth();
// =========================================================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được đặt bên trong AuthProvider!');
  }
  return context;
};
