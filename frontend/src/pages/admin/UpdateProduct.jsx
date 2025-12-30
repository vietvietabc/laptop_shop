import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsApi } from "../../services/api";
import "./CreateUser.css"; // Tái sử dụng CSS

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    factory: "",
    target: "",
    short_desc: "",
    detail_desc: "",
    image: "", // Lưu tên file ảnh cũ
  });

  const [selectedFile, setSelectedFile] = useState(null); // File ảnh mới (nếu có)
  const [preview, setPreview] = useState(null); // Link ảnh xem trước

  // 1. Load dữ liệu cũ khi vào trang
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsApi.getById(id);
        const data = res.data;

        setFormData({
          name: data.name,
          price: data.price,
          quantity: data.quantity,
          factory: data.factory || "",
          target: data.target || "",
          short_desc: data.short_desc || "",
          detail_desc: data.detail_desc,
          image: data.image || "", // Lưu lại tên ảnh cũ
        });

        // Nếu có ảnh cũ thì hiển thị
        if (data.image) {
          setPreview(`http://localhost:8000/uploads/${data.image}`);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        alert("Không tìm thấy sản phẩm!");
        navigate("/admin/products");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // Xử lý thay đổi input text
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý chọn ảnh mới
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Hiển thị ảnh mới chọn
    }
  };

  // 2. Submit Form Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageToSave = formData.image; // Mặc định là giữ ảnh cũ

      // Nếu người dùng chọn ảnh mới -> Upload ảnh mới
      if (selectedFile) {
        const uploadRes = await productsApi.uploadImage(selectedFile);
        imageToSave = uploadRes.data.image_name; // Lấy tên ảnh mới
      }

      // Chuẩn bị dữ liệu gửi đi (JSON)
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        image: imageToSave, // Cập nhật tên ảnh (cũ hoặc mới)
      };

      await productsApi.update(id, updateData);

      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert(
        "Lỗi cập nhật: " + (error.response?.data?.detail || "Có lỗi xảy ra")
      );
    }
  };

  return (
    <div className="create-user-container">
      <div className="header-actions">
        <div>
          <h2>Cập nhật sản phẩm</h2>
          <span className="breadcrumb">Dashboard / Products / Update</span>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate("/admin/products")}
        >
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
            <label>Tên sản phẩm</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Hãng sản xuất</label>
            <input
              type="text"
              name="factory"
              value={formData.factory}
              onChange={handleChange}
            />
          </div>
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
        </div>

        <div className="form-row">
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
            <label>Đối tượng</label>
            <input
              type="text"
              name="target"
              value={formData.target}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả ngắn</label>
          <input
            type="text"
            name="short_desc"
            value={formData.short_desc}
            onChange={handleChange}
          />
        </div>

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

        <div className="form-row">
          <div className="form-group">
            <label>Thay đổi hình ảnh</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
          <div className="preview-section" style={{ marginTop: 0 }}>
            <label>Ảnh hiện tại / Mới</label>
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
            Lưu thay đổi
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

export default UpdateProduct;
