from pydantic import BaseModel, Field
from typing import List, Optional # Nhớ import List
from datetime import datetime

# ... OrderBase giữ nguyên ...
class OrderBase(BaseModel):
    receiver_name: str = Field(..., alias="receiverName")
    receiver_phone: str = Field(..., alias="receiverPhone")
    receiver_address: str = Field(..., alias="receiverAddress")
    status: Optional[str] = "PENDING"

# SỬA Ở ĐÂY: Thêm list product_ids
class OrderCreate(OrderBase):
    product_ids: List[int] = Field(..., description="Danh sách ID sản phẩm muốn mua")

# ... OrderResponse giữ nguyên ...
class OrderResponse(OrderBase):
    id: int
    user_id: int
    total_price: float = Field(..., alias="totalPrice")
    order_date: datetime = Field(..., alias="orderDate")
    
    class Config:
        from_attributes = True
        populate_by_name = True