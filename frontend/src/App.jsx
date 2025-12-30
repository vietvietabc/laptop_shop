import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import ManageUser from "./pages/admin/ManageUser"; //
import CreateUser from "./pages/admin/CreateUser";
import ViewUser from "./pages/admin/ViewUser";
import UpdateUser from "./pages/admin/UpdateUser";
import ManageProduct from "./pages/admin/ManageProduct";
import CreateProduct from "./pages/admin/CreateProduct";
import ViewProduct from "./pages/admin/ViewProduct";
import UpdateProduct from "./pages/admin/UpdateProduct";
import ManageOrder from "./pages/admin/ManageOrder";
import ViewOrder from "./pages/admin/ViewOrder";
import UpdateOrder from "./pages/admin/UpdateOrder";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Các trang Admin khác (vẫn giữ nguyên dạng placeholder vì chưa tạo file thật)
const Dashboard = () => <h2>Trang Thống Kê</h2>;

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Bọc toàn bộ app */}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <h1>
                Trang chủ Client (Đang cập nhật){" "}
                <a href="/login">Login Admin</a>
              </h1>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="users" element={<ManageUser />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="users/:id" element={<ViewUser />} />
            <Route path="users/update/:id" element={<UpdateUser />} />

            <Route path="products" element={<ManageProduct />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/:id" element={<ViewProduct />} />
            <Route path="products/update/:id" element={<UpdateProduct />} />

            <Route path="orders" element={<ManageOrder />} />
            <Route path="orders/:id" element={<ViewOrder />} />
            <Route path="orders/update/:id" element={<UpdateOrder />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
