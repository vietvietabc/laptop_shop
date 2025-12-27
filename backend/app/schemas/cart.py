from pydantic import BaseModel
from typing import List, Optional

# --- Định nghĩa lại ProductResponse rút gọn ở đây để tránh import chéo file product.py ---
class ProductRef(BaseModel):
    id: int
    name: str
    price: float
    image: Optional[str] = None
    class Config:
        from_attributes = True

# Schema hiển thị từng món hàng
class CartItemResponse(BaseModel):
    id: int
    quantity: int
    product: ProductRef # Nhúng thông tin sản phẩm
    class Config:
        from_attributes = True

# Schema hiển thị giỏ hàng tổng
class CartResponse(BaseModel):
    id: int
    # user: UserResponse  <-- XÓA DÒNG NÀY ĐI (Thủ phạm gây xoay vòng)
    cart_details: List[CartItemResponse] = []
    
    class Config:
        from_attributes = True