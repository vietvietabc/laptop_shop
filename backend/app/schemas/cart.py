from pydantic import BaseModel, Field
from typing import Optional, List

# Base class
class CartBase(BaseModel):
    # @Min(value = 0) -> ge=0 (greater or equal 0)
    sum: int = Field(0, ge=0)

# Dùng cho Request tạo mới (Thường Cart được tạo tự động kèm User, không cần client gửi)
class CartCreate(CartBase):
    pass

# Dùng cho Request Update (Cập nhật tổng số lượng)
class CartUpdate(CartBase):
    pass

# Dùng cho Response
class CartResponse(CartBase):
    id: int
    user_id: int
    
    # Nếu muốn trả về danh sách chi tiết giỏ hàng
    # cart_details: List[CartDetailResponse] = []

    class Config:
        from_attributes = True