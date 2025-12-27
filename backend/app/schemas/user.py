from pydantic import BaseModel
from typing import Optional

# Base schema
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

# --- QUAN TRỌNG: UserResponse chỉ trả về thông tin cá nhân, KHÔNG trả về Cart hay Order ---
class UserResponse(UserBase):
    id: int
    role_id: int
    
    class Config:
        from_attributes = True # Pydantic v2 dùng from_attributes thay vì orm_mode

class Token(BaseModel):
    access_token: str
    token_type: str