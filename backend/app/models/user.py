from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    full_name = Column(String(255))
    phone = Column(String(20))
    address = Column(String(500))
    role_id = Column(Integer, ForeignKey("roles.id"))
    
    role = relationship("Role", back_populates="users")
    cart = relationship("Cart", back_populates="user", uselist=False)
    # orders = relationship("Order", back_populates="user") # Tạm ẩn để code gọn