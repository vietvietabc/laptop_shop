from pydantic import BaseModel
from typing import List, Optional

# 1. Định nghĩa Schema cho chi tiết món hàng
class CartDetailOut(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    
    class Config:
        from_attributes = True

# 2. Định nghĩa Schema cho Giỏ hàng to
class CartOut(BaseModel):
    id: int
    sum: float      
    user_id: int
    
    # --- QUAN TRỌNG: Thêm dòng này để hiện danh sách ---
    cart_details: List[CartDetailOut] = [] 

    class Config:
        from_attributes = True