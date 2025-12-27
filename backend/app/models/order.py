from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base  # ✓ Sửa: bỏ "backend."
import datetime

class Order(Base):
    __tablename__ = "orders"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    # double totalPrice -> Float
    total_price = Column(Float, default=0.0)

    # String receiverName - Thêm độ dài String(100)
    receiver_name = Column(String(100), nullable=True)

    # String receiverPhone - Thêm độ dài String(20)
    receiver_phone = Column(String(20), nullable=True)

    # String receiverAddress - Thêm độ dài String(255)
    receiver_address = Column(String(255), nullable=True)

    # Thêm độ dài String(50) cho status
    status = Column(String(50), default="PENDING")

    # @PrePersist handleBeforeCreate -> default=func.now()
    # Tự động lưu thời gian hiện tại khi tạo record
    order_date = Column(DateTime(timezone=True), server_default=func.now())

    # @ManyToOne @JoinColumn(name = "user_id")
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="orders")

    # @OneToMany(mappedBy = "order")
    # Cần class OrderDetail định nghĩa relationship ngược lại
    order_details = relationship("OrderDetail", back_populates="order")

    def __repr__(self):
        return f"<Order(id={self.id}, total_price={self.total_price}, status={self.status})>"