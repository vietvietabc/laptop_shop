from pydantic import BaseModel
from typing import Optional

# Base class
class OrderDetailBase(BaseModel):
    quantity: int
    price: float

# Dùng cho Request tạo mới (Client gửi lên)
class OrderDetailCreate(OrderDetailBase):
    # Cần gửi kèm ID sản phẩm để biết mua cái gì
    product_id: int 
    # order_id thường được backend tự gán khi tạo Order cha, không cần client gửi

# Dùng cho Response (Server trả về)
class OrderDetailResponse(OrderDetailBase):
    id: int
    order_id: int
    product_id: int

    # Nếu muốn trả về thông tin chi tiết tên sản phẩm luôn:
    # product_name: Optional[str] = None 
    # (Cần xử lý logic map dữ liệu thêm trong route nếu dùng trường này)

    class Config:
        from_attributes = True