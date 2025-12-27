from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  # ✓ Sửa: bỏ "backend."

class Cart(Base):
    __tablename__ = "carts"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    # @Min(value = 0) - Validation sẽ nằm ở Schema (Pydantic)
    # Tên biến 'sum' trong Python trùng với hàm tính tổng có sẵn, 
    # nhưng trong class scope thì vẫn dùng được. 
    # Tuy nhiên, khuyến khích đổi tên thành 'total' hoặc 'quantity_sum'.
    sum = Column(Integer, default=0)

    # @OneToOne @JoinColumn(name = "user_id")
    # Trong database, OneToOne thực chất là ForeignKey có rằng buộc Unique
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Relationship ngược lại với User
    user = relationship("User", back_populates="cart")

    # @OneToMany(mappedBy = "cart")
    # Đổi tên CartDetail (Java) -> cart_details (Python chuẩn snake_case)
    cart_details = relationship("CartDetail", back_populates="cart")

    def __repr__(self):
        return f"<Cart(id={self.id}, sum={self.sum})>"