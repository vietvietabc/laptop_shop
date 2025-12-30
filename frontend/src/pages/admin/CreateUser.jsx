import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../services/api";
import "./CreateUser.css"; // Chúng ta sẽ tạo file css ngay sau đây

const CreateUser = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    address: "",
    role_id: "2", // Mặc định là USER (giả sử ID 2 là User, 1 là Admin)
  });

  const [avatar, setAvatar] = useState(null); // File ảnh thật
  const [preview, setPreview] = useState(null); // Link ảnh xem trước

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gom dữ liệu vào FormData để gửi Backend
    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("role_id", formData.role_id);
    if (avatar) {
      data.append("file", avatar);
    }

    try {
      await userApi.create(data);
      alert("Tạo người dùng thành công!");
      navigate("/admin/users"); // Quay về trang danh sách
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + (error.response?.data?.detail || "Có lỗi xảy ra"));
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Thêm người dùng</h2>
          <span className="breadcrumb">Dashboard / Users / Create</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/users")}>
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              name="phone"
              placeholder="Ví dụ: 0901234567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Role</label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
            >
              <option value="1">ADMIN</option>
              <option value="2">USER</option>
            </select>
          </div>
          <div className="form-group">
            <label>Avatar (chọn ảnh)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
        </div>

        {/* Xem trước ảnh */}
        <div className="preview-section">
          <label>Xem trước Avatar</label>
          <div className="img-preview-box">
            {preview ? (
              <img src={preview} alt="Preview" />
            ) : (
              <span>No Image</span>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Submit
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/users")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
