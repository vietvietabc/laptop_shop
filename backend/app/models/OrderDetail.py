from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  # ✓ Sửa: bỏ "backend."

class OrderDetail(Base):
    __tablename__ = "order_detail"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    # long quantity -> Integer
    quantity = Column(Integer, nullable=False)

    # double price -> Float
    price = Column(Float, nullable=False)

    # @ManyToOne @JoinColumn(name = "order_id")
    order_id = Column(Integer, ForeignKey("orders.id"))
    # 'order_details' phải khớp với tên biến relationship trong model Order
    order = relationship("Order", back_populates="order_details")

    # @ManyToOne @JoinColumn(name = "product_id")
    product_id = Column(Integer, ForeignKey("products.id"))
    # Link tới bảng products
    product = relationship("Product") 

    def __repr__(self):
        return f"<OrderDetail(id={self.id}, product_id={self.product_id}, quantity={self.quantity})>"