import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
// SỬA: Xóa dấu cách thừa ở dòng dưới
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email, password) =>
    // FastAPI thường yêu cầu form-data cho login (OAuth2PasswordRequestForm)
    // Code này dùng URLSearchParams là chính xác với FastAPI chuẩn.
    api.post(
      "/auth/login",
      new URLSearchParams({ username: email, password }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    ),
  register: (userData) => api.post("/auth/register", userData),
};

// Users API (THÊM MỚI: Dùng cho trang Admin quản lý người dùng)
export const userApi = {
  getAll: () => api.get("/users"), // Cần đảm bảo backend có endpoint này
  delete: (id) => api.delete(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => {
    // Vì có file ảnh nên browser sẽ tự động set Content-Type là multipart/form-data
    // khi ta gửi đối tượng FormData
    return api.post("/users/", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, data) => {
    return api.put(`/users/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Products API
export const productsApi = {
  getAll: (params) => api.get("/products/", { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products/", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post("/products/upload-image", formData, {
      headers: {
        "Content-Type": undefined, // <--- QUAN TRỌNG: Ghi đè header mặc định
      },
    });
  },
};

// Cart API
export const cartApi = {
  get: () => api.get("/cart"),
  add: (productId) => api.post(`/cart/add/${productId}`),
  increase: (productId) => api.post(`/cart/increase/${productId}`),
  decrease: (productId) => api.post(`/cart/decrease/${productId}`),
  remove: (cartDetailId) => api.delete(`/cart/remove/${cartDetailId}`),
  clear: () => api.delete("/cart/clear"),
};

export const orderApi = {
  getAll: () => api.get("/orders/"),
  getById: (id) => api.get(`/orders/${id}`),
  update: (id, data) => api.put(`/orders/${id}`, data),
};

export default api;
