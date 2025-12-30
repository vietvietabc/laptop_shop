import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";
import "./AdminLayout.css"; // Chúng ta sẽ tạo file CSS này sau

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-brand">
        <h2>LaptopShop</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaTachometerAlt className="icon" /> Thống kê
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaUsers className="icon" /> Người dùng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaBoxOpen className="icon" /> Sản phẩm
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <FaShoppingCart className="icon" /> Đơn hàng
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
