from sqlalchemy import Column, Integer, String, Float, Text
from database import Base  

class Product(Base):
    __tablename__ = "products"

    # @Id @GeneratedValue
    id = Column(Integer, primary_key=True, index=True)

    # Thêm độ dài cho String: String(200)
    name = Column(String(200), nullable=True)

    # @NotNull, @DecimalMin("0.01")
    # Trong DB ta set nullable=False, validation chi tiết sẽ nằm ở Schema
    price = Column(Float, nullable=False)

    # String cho đường dẫn ảnh: String(500)
    image = Column(String(500), nullable=True)

    # @Column(columnDefinition = "MEDIUMTEXT")
    # Sử dụng kiểu Text cho nội dung dài (Text không cần độ dài)
    detail_desc = Column(Text, nullable=False) # Đổi tên detailDesc -> detail_desc

    # String cho mô tả ngắn: String(500) hoặc Text
    short_desc = Column(Text, nullable=True) # Đổi tên shortDesc -> short_desc

    # @NotNull, @Min(0)
    quantity = Column(Integer, nullable=False)

    sold = Column(Integer, default=0) # Mặc định là 0 nếu không có giá trị
    
    # String cho nhà sản xuất: String(100)
    factory = Column(String(100), nullable=True)
    
    # String cho đối tượng mục tiêu: String(100)
    target = Column(String(100), nullable=True)

    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, price={self.price})>"