from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  # ✓ Sửa: bỏ "backend."

class CartDetail(Base):
    __tablename__ = "cart_detail"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    # long quantity -> Integer
    quantity = Column(Integer, default=0)

    # double price -> Float
    price = Column(Float, default=0.0)

    # @ManyToOne @JoinColumn(name = "cart_id")
    cart_id = Column(Integer, ForeignKey("carts.id"))
    
    # Relationship ngược lại với Cart
    # 'cart_details' phải khớp với tên biến relationship trong model Cart bạn đã tạo trước đó
    cart = relationship("Cart", back_populates="cart_details")

    # @ManyToOne @JoinColumn(name = "product_id")
    product_id = Column(Integer, ForeignKey("products.id"))
    
    # Link tới bảng Product để lấy thông tin sản phẩm
    product = relationship("Product")

    def __repr__(self):
        return f"<CartDetail(id={self.id}, cart_id={self.cart_id}, product_id={self.product_id})>"