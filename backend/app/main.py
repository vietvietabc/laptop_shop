import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles

from database import engine, Base, SessionLocal
from .routers import auth, product  # Import routers (Auth và Product)
from .models import Role, User # Import models để SQLAlchemy nhận diện bảng

# --- 2. Tạo bảng trong Database (nếu chưa có) ---
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Laptop Shop API",
    description="API cho ứng dụng bán laptop với Authentication",
    version="1.0.0"
)

script_dir = os.path.dirname(__file__) 
base_dir = os.path.dirname(script_dir) 
upload_path = os.path.join(base_dir, "uploads")

if not os.path.exists(upload_path):
    os.makedirs(upload_path)

app.mount("/uploads", StaticFiles(directory=upload_path), name="uploads")

# --- 3. Cấu hình CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production nên đổi thành domain frontend cụ thể (vd: ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. Đăng ký các Router ---
# Đây là bước quan trọng để các API trong auth.py hoạt động
app.include_router(auth.router)
# Sau này có thêm router khác thì thêm vào đây:
    # Đăng ký các router khác
app.include_router(product.router)
# app.include_router(cart.router)

# --- 5. API Root ---
@app.get("/")
def root():
    return {
        "message": "Welcome to Laptop Shop API",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "version": "1.0.0"
    }