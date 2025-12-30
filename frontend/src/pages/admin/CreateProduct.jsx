import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../../services/api";
import "./CreateUser.css"; // Tái sử dụng CSS của trang Create User

const CreateProduct = () => {
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    factory: "",
    target: "",
    short_desc: "", // Lưu ý: Tên biến phải khớp với schema Python (snake_case)
    detail_desc: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageParams = ""; // Mặc định là chuỗi rỗng nếu không up ảnh

      // BƯỚC 1: Upload ảnh trước (nếu có chọn)
      if (selectedFile) {
        const uploadRes = await productsApi.uploadImage(selectedFile);
        // Backend trả về: { "image_name": "abc.jpg", "url": "..." }
        imageParams = uploadRes.data.image_name;
      }

      // BƯỚC 2: Tạo sản phẩm (Gửi JSON)
      const productData = {
        ...formData,
        price: parseFloat(formData.price), // Chuyển sang số thực
        quantity: parseInt(formData.quantity), // Chuyển sang số nguyên
        image: imageParams, // Gán tên ảnh vừa upload được vào đây
      };

      await productsApi.create(productData);

      alert("Thêm sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + (error.response?.data?.detail || "Có lỗi xảy ra"));
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Thêm sản phẩm mới</h2>
          <span className="breadcrumb">Dashboard / Products / Create</span>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate("/admin/products")}
        >
          Quay lại
        </button>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        {/* Hàng 1: Tên và Hãng */}
        <div className="form-row">
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Hãng sản xuất (Factory)</label>
            <input
              type="text"
              name="factory"
              placeholder="Dell, Asus, Macbook..."
              value={formData.factory}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Hàng 2: Giá, Số lượng, Đối tượng */}
        <div className="form-row">
          <div className="form-group">
            <label>Giá (VNĐ)</label>
            <input
              type="number"
              name="price"
              required
              min="1"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Số lượng kho</label>
            <input
              type="number"
              name="quantity"
              required
              min="0"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Đối tượng (Target)</label>
            <input
              type="text"
              name="target"
              placeholder="Gaming, Văn phòng..."
              value={formData.target}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Hàng 3: Mô tả ngắn */}
        <div className="form-group">
          <label>Mô tả ngắn</label>
          <input
            type="text"
            name="short_desc"
            value={formData.short_desc}
            onChange={handleChange}
          />
        </div>

        {/* Hàng 4: Mô tả chi tiết (Textarea) */}
        <div className="form-group">
          <label>Mô tả chi tiết</label>
          <textarea
            name="detail_desc"
            rows="5"
            required
            value={formData.detail_desc}
            onChange={handleChange}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Hàng 5: Chọn ảnh */}
        <div className="form-row">
          <div className="form-group">
            <label>Hình ảnh sản phẩm</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
          <div className="preview-section" style={{ marginTop: 0 }}>
            <div className="img-preview-box">
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <span>No Image</span>
              )}
            </div>
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-submit">
            Tạo mới
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/products")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
