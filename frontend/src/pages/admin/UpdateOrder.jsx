import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderApi } from "../../services/api";
import "./CreateUser.css"; // Tái sử dụng CSS form

const UpdateOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    receiver_name: "",
    receiver_phone: "",
    receiver_address: "",
    status: "PENDING",
  });

  // 1. Load dữ liệu đơn hàng cũ
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(id);
        const data = res.data;
        setFormData({
          receiver_name: data.receiver_name,
          receiver_phone: data.receiver_phone,
          receiver_address: data.receiver_address,
          status: data.status,
        });
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
        alert("Không tìm thấy đơn hàng!");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Submit Form Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderApi.update(id, formData);
      alert("Cập nhật đơn hàng thành công!");
      navigate("/admin/orders");
    } catch (error) {
      console.error(error);
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.detail || "Có lỗi xảy ra")
      );
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu...</div>;

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Cập nhật đơn hàng #{id}</h2>
          <span className="breadcrumb">Dashboard / Orders / Update</span>
        </div>
        <button className="btn-back" onClick={() => navigate("/admin/orders")}>
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        {/* Chọn trạng thái (Quan trọng nhất) */}
        <div className="form-group">
          <label style={{ fontWeight: "bold", color: "#2563eb" }}>
            Trạng thái đơn hàng
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontWeight: "bold",
            }}
          >
            <option value="PENDING">PENDING (Chờ xử lý)</option>
            <option value="SHIPPING">SHIPPING (Đang giao)</option>
            <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
            <option value="CANCELLED">CANCELLED (Đã hủy)</option>
          </select>
        </div>

        {/* Thông tin giao hàng */}
        <div className="form-row">
          <div className="form-group">
            <label>Tên người nhận</label>
            <input
              type="text"
              name="receiver_name"
              required
              value={formData.receiver_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              name="receiver_phone"
              required
              value={formData.receiver_phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Địa chỉ giao hàng</label>
          <textarea
            name="receiver_address"
            rows="3"
            required
            value={formData.receiver_address}
            onChange={handleChange}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Lưu thay đổi
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/orders")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOrder;
