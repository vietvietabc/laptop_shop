# schemas.py
from pydantic import BaseModel
from typing import List, Optional

# Base class chứa các trường chung
class RoleBase(BaseModel):
    name: str

# Class dùng để tạo mới (POST request)
class RoleCreate(RoleBase):
    pass

# Class dùng để update (PUT request)
class RoleUpdate(RoleBase):
    pass

# Class dùng để trả về dữ liệu (Response)
class RoleResponse(RoleBase):
    id: int

    class Config:
        from_attributes = True