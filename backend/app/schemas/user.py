# File: app/schemas/User.py

from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, alias="fullName")
    address: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(BaseModel): # Tạo riêng cho đăng ký, bỏ avatar
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str = Field(..., min_length=2, alias="fullName")
    address: Optional[str] = None
    phone: Optional[str] = None

class UserOut(UserBase):
    id: int
    role_id: int
    avatar: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

# --- THÊM CLASS NÀY VÀO ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut