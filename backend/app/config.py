import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Khai báo các biến cần thiết (tên phải trùng khớp với trong .env)
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256" # Có thể đặt giá trị mặc định nếu trong env không có
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    UPLOAD_DIR: str = "uploads"

    # Cấu hình để nó tự tìm file .env
    class Config:
        env_file = ".env" 
        env_file_encoding = 'utf-8'

# Khởi tạo
settings = Settings()