from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .config import settings

# --- IMPORT TẤT CẢ MODELS TẠI ĐÂY ---
from .models import role, user, product, cart 
# ------------------------------------

from .routers import auth, products

# Tạo bảng database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file (Ảnh)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")

# Routers
app.include_router(auth.router)
app.include_router(products.router)

@app.get("/")
def root():
    return {"message": "Laptop Shop API is running!"}