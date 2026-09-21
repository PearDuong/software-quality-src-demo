// Định nghĩa kiểu thông tin người dùng từ DummyJSON
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  token?: string;
}

// Kiểu dữ liệu cho Context API
export interface AuthContextType {
  user: User | null;              // Người dùng hiện tại đang đăng nhập
  usersList: User[];             // Danh sách người dùng lấy từ DummyJSON
  isLoading: boolean;            // Trạng thái đang tải dữ liệu
  error: string | null;          // Thông báo lỗi nếu có
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUsers: () => Promise<void>; // Lấy danh sách users từ dummyjson.com/users
}
