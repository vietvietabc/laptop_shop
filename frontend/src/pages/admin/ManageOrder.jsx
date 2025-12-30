import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { orderApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./ManageProduct.css";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll();
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span
            className="status-badge pending"
            style={{
              color: "#d97706",
              background: "#fef3c7",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
            }}
          >
            CHỜ XỬ LÝ
          </span>
        );
      case "COMPLETED":
        return (
          <span
            className="status-badge completed"
            style={{
              color: "#059669",
              background: "#d1fae5",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
            }}
          >
            HOÀN THÀNH
          </span>
        );
      case "CANCELLED":
        return (
          <span
            className="status-badge cancelled"
            style={{
              color: "#dc2626",
              background: "#fee2e2",
              padding: "5px 10px",
              borderRadius: "15px",
              fontSize: "12px",
            }}
          >
            ĐÃ HỦY
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="manage-product-container">
      <div className="title-section">
        <h2>Quản lý đơn hàng</h2>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Địa chỉ</th> {/* Đã thêm cột Địa chỉ */}
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((item) => (
                <tr key={item.id}>
                  {/* ID */}
                  <td style={{ color: "#2563eb", fontWeight: "bold" }}>
                    #{item.id}
                  </td>

                  {/* Khách hàng */}
                  <td>
                    <div style={{ fontWeight: "bold", color: "#333" }}>
                      {item.receiver_name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      📞 {item.receiver_phone}
                    </div>
                    <small style={{ color: "#999" }}>{item.user?.email}</small>
                  </td>

                  {/* Địa chỉ (Mới thêm) */}
                  <td style={{ maxWidth: "250px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "start",
                        gap: "5px",
                      }}
                    >
                      <span>{item.receiver_address || "Chưa có địa chỉ"}</span>
                    </div>
                  </td>

                  {/* Ngày đặt */}
                  <td style={{ fontSize: "15px", color: "#555" }}>
                    {formatDate(item.order_date)}
                  </td>

                  {/* Tổng tiền (Màu xanh lá giống ảnh) */}
                  <td
                    style={{
                      color: "#059669",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {formatCurrency(item.total_price)}
                  </td>

                  {/* Trạng thái */}
                  <td>{getStatusBadge(item.status)}</td>

                  {/* Hành động */}
                  <td>
                    <button
                      className="action-btn view"
                      style={{ marginRight: "5px" }}
                      onClick={() => navigate(`/admin/orders/${item.id}`)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn edit"
                      style={{
                        marginRight: "5px",
                        background: "#fef3c7",
                        color: "#d97706",
                      }}
                      // Bỏ dòng alert cũ đi
                      // onClick={() => alert("Chức năng cập nhật đơn hàng sẽ làm sau")}

                      // MỞ LẠI DÒNG NÀY:
                      onClick={() =>
                        navigate(`/admin/orders/update/${item.id}`)
                      }
                      title="Cập nhật đơn hàng"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  Chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrder;
