from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  

class Cart(Base):
    __tablename__ = "carts"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    sum = Column(Integer, default=0)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    
    # Relationship ngược lại với User
    user = relationship("User", back_populates="cart")

    # @OneToMany(mappedBy = "cart")
    # Đổi tên CartDetail (Java) -> cart_details (Python chuẩn snake_case)
    cart_details = relationship("CartDetail", back_populates="cart")

    def __repr__(self):
        return f"<Cart(id={self.id}, sum={self.sum})>"