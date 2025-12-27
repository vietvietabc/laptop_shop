from pydantic import BaseModel, Field
from typing import Optional

# Base class chứa các trường chung
class CartDetailBase(BaseModel):
    # Validation cơ bản: số lượng >= 1
    quantity: int = Field(..., ge=1, description="Số lượng mua phải ít nhất là 1")
    price: float = Field(..., ge=0)

# Class dùng cho Request tạo mới (Thêm vào giỏ)
class CartDetailCreate(CartDetailBase):
    product_id: int
    # cart_id thường được backend tự lấy từ User đang đăng nhập,
    # nhưng nếu API yêu cầu gửi thì thêm vào đây.

# Class dùng cho Response (Trả về client)
class CartDetailResponse(CartDetailBase):
    id: int
    cart_id: int
    product_id: int
    
    # Nếu muốn trả về thông tin tên/ảnh sản phẩm kèm theo luôn
    # (cần xử lý trong logic backend để map data)
    # product_name: Optional[str] = None
    # product_image: Optional[str] = None

    class Config:
        from_attributes = True