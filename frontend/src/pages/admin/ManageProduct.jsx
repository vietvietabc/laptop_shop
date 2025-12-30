import React, { useEffect, useState } from "react";
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { productsApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./ManageProduct.css"; // Import CSS

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll();
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productsApi.delete(id);
        alert("Xóa thành công!");
        fetchProducts();
      } catch (error) {
        console.error(error);
        alert("Xóa thất bại!");
      }
    }
  };

  // Hàm format giá tiền VND
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="manage-product-container">
      <div className="title-section">
        <h2>Quản lý sản phẩm</h2>
        <button
          className="btn-create"
          onClick={() => navigate("/admin/products/create")}
        >
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Đã bán</th>
              <th>Hãng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id}>
                  <td>#{item.id}</td>
                  <td>
                    {item.image ? (
                      <img
                        src={`http://localhost:8000/uploads/${item.image}`}
                        alt={item.name}
                        className="product-thumb"
                      />
                    ) : (
                      <span>No img</span>
                    )}
                  </td>
                  <td style={{ maxWidth: "200px" }}>{item.name}</td>
                  <td className="price-text">{formatCurrency(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sold || 0}</td>
                  <td>{item.factory}</td>
                  <td>
                    <button
                      className="action-btn view"
                      onClick={() => navigate(`/admin/products/${item.id}`)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn edit"
                      onClick={() =>
                        navigate(`/admin/products/update/${item.id}`)
                      }
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
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Chưa có sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProduct;
