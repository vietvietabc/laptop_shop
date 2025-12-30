import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../services/api";
import "./CreateUser.css"; // Tái sử dụng CSS

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "", // Để trống, nếu nhập thì mới đổi pass
    fullName: "",
    phone: "",
    address: "",
    role_id: "2",
  });

  const [avatar, setAvatar] = useState(null); // File mới chọn
  const [currentAvatar, setCurrentAvatar] = useState(null); // Link ảnh cũ từ server
  const [preview, setPreview] = useState(null); // Link ảnh xem trước của file mới

  // Lấy dữ liệu user cần sửa
  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const res = await userApi.getById(id);
      const data = res.data;
      setFormData({
        email: data.email,
        password: "", // Không hiển thị password cũ
        fullName: data.fullName || data.full_name,
        phone: data.phone || "",
        address: data.address || "",
        role_id: data.role_id,
      });
      if (data.avatar) {
        setCurrentAvatar(`http://localhost:8000/uploads/${data.avatar}`);
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi tải dữ liệu user!");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    // Không gửi email vì backend không update email
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("role_id", formData.role_id);

    // Chỉ gửi password nếu người dùng có nhập
    if (formData.password) {
      data.append("password", formData.password);
    }

    // Nếu có chọn ảnh mới thì gửi, không thì thôi
    if (avatar) {
      data.append("file", avatar);
    }

    try {
      await userApi.update(id, data);
      alert("Cập nhật thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Cập nhật người dùng</h2>
          <span className="breadcrumb">Dashboard / Users / Update</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/users")}>
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              value={id}
              disabled
              style={{ background: "#f1f1f1" }}
            />
          </div>
          <div className="form-group">
            <label>Email (Không thể sửa)</label>
            {/* QUAN TRỌNG: disabled để không cho sửa */}
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              style={{ background: "#e9ecef", cursor: "not-allowed" }}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password (Để trống nếu không đổi)</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu mới..."
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Phone number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
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
            <label>Thay đổi Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
        </div>

        <div className="preview-section">
          <label>Avatar hiện tại / Mới</label>
          <div className="img-preview-box">
            {/* Ưu tiên hiển thị ảnh mới chọn (preview), nếu không thì hiện ảnh cũ (currentAvatar) */}
            {preview ? (
              <img src={preview} alt="New Preview" />
            ) : currentAvatar ? (
              <img src={currentAvatar} alt="Current" />
            ) : (
              <span>No Avatar</span>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Lưu thay đổi
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

export default UpdateUser;
