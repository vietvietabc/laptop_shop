from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Base class
class OrderBase(BaseModel):
    total_price: float = Field(..., alias="totalPrice")
    receiver_name: str = Field(..., alias="receiverName")
    receiver_phone: str = Field(..., alias="receiverPhone")
    receiver_address: str = Field(..., alias="receiverAddress")
    status: Optional[str] = "PENDING"

# Dùng cho Request tạo mới (Client gửi lên)
class OrderCreate(OrderBase):
    # User ID thường lấy từ Token, nhưng nếu gửi kèm thì thêm vào đây
    pass

# Dùng cho Response (Server trả về)
class OrderResponse(OrderBase):
    id: int
    user_id: int
    order_date: datetime = Field(..., alias="orderDate")
    
    # Nếu muốn trả về danh sách chi tiết đơn hàng
    # order_details: List[OrderDetailResponse] = []

    class Config:
        from_attributes = True
        # populate_by_name = True giúp map tự động snake_case (Python) <-> camelCase (JSON)
        # Ví dụ: Python dùng receiver_name, nhưng JSON trả về là receiverName
        populate_by_name = True