import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api"; // Đảm bảo đường dẫn đúng
import { AuthContext } from "../../context/AuthContext";
import "./Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset lỗi cũ

    try {
      // 1. Gọi API Login
      // Lưu ý: authApi.login trong api.js của bạn đang dùng URLSearchParams
      // Backend trả về: { access_token: "...", token_type: "bearer", user: {...} }
      const res = await authApi.login(email, password);

      // 2. Lưu thông tin vào Context & LocalStorage
      // Giả sử backend trả về cấu trúc res.data.user (chứa email, role...)
      // Nếu backend chỉ trả token, bạn cần gọi thêm API /users/me để lấy info.
      // Tạm thời mình giả định cấu trúc trả về như file schemas/User.py
      const token = res.data.access_token;
      const userData = { email: email, role_id: 1 }; // Mock tạm hoặc lấy từ res.data.user nếu có

      login(userData, token);

      // 3. Chuyển hướng
      alert("Đăng nhập thành công!");
      navigate("/admin"); // Hoặc trang chủ "/"
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không chính xác!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">R</div>
          <div className="auth-title">
            <h2>Đăng nhập</h2>
            <p>Nhập email password để đăng nhập</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="......"
              required
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

          <button type="submit" className="btn-auth">
            Đăng nhập
          </button>
        </form>

        <div className="auth-footer">
          Đã chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
