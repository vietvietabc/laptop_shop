from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  

class User(Base):
    __tablename__ = "users"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    # @Email, @NotNull, @NotEmpty
    # unique=True là best practice cho email
    email = Column(String(100), unique=True, index=True, nullable=False)

    # @NotNull, @Size...
    password = Column(String(255), nullable=False)

    # @NotNull, @Size(min = 2)
    # Đổi fullName -> full_name theo chuẩn Python
    full_name = Column(String(100), nullable=False)

    address = Column(String(255), nullable=True)

    # @Pattern
    phone = Column(String(20), nullable=True)

    avatar = Column(String(500), nullable=True)

    # @ManyToOne @JoinColumn(name = "role_id")
    role_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")


    orders = relationship("Order", back_populates="user")

    cart = relationship("Cart", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, full_name={self.full_name})>"