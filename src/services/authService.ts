// =========================================================================
// API Service đơn giản để gọi dữ liệu từ https://dummyjson.com
// =========================================================================
const BASE_URL = 'https://dummyjson.com';

export const authService = {
  // 1. API Đăng nhập
  async login(username: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 60,
      }),
    });
    return response.json();
  },

  // 2. API Lấy danh sách người dùng
  async getUsers(limit: number = 8) {
    const response = await fetch(`${BASE_URL}/users?limit=${limit}`);
    return response.json();
  },
};
