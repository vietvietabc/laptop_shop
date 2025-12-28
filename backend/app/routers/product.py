from fastapi import APIRouter, Depends, HTTPException, status,File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from ..models.Product import Product
from ..schemas.Product import ProductCreate, ProductOut, ProductUpdate
from .auth import get_current_user 
import os
import shutil
import uuid

router = APIRouter(prefix="/products", tags=["Products"])

# Lấy danh sách (Ai cũng xem được)
@router.get("/", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

# Lấy chi tiết 1 máy (Ai cũng xem được)
@router.get("/{id}", response_model=ProductOut)
def get_product(id: int, db: Session = Depends(get_db)):
    item = db.query(Product).filter(Product.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")
    return item

# Thêm máy mới (Chỉ Admin role_id == 1)
@router.post("/", response_model=ProductOut)
def create_product(
    product_in: ProductCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Chỉ Admin mới có quyền thêm sản phẩm")
    
    new_product = Product(**product_in.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# Xóa máy (Chỉ Admin)
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Không có quyền xóa")
    
    db_product = db.query(Product).filter(Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    
    db.delete(db_product)
    db.commit()
    return None

@router.post("/upload-image")
def upload_product_image(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user)
):
    # 1. Chỉ Admin mới được upload
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Chỉ Admin mới có quyền upload ảnh")

    # 2. Kiểm tra định dạng file (tùy chọn)
    allowed_extensions = ["jpg", "jpeg", "png", "webp"]
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận ảnh định dạng jpg, png, webp")

    # 3. Tạo tên file duy nhất để không bị trùng (dùng UUID)
    file_name = f"{uuid.uuid4()}.{file_ext}"
    
    # Đường dẫn lưu file (nhớ khớp với thư mục uploads bạn đã tạo)
    file_path = os.path.join("uploads", file_name)

    # 4. Lưu file vào thư mục
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 5. Trả về tên file để sau này lưu vào Database
    return {"image_name": file_name, "url": f"/uploads/{file_name}"}

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Kiểm tra quyền Admin
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Chỉ Admin mới được sửa sản phẩm")

    # 2. Tìm sản phẩm trong DB
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

    # 3. Cập nhật dữ liệu (Chỉ cập nhật những trường Admin gửi lên)
    # exclude_unset=True nghĩa là trường nào Admin không gửi thì giữ nguyên cái cũ
    update_data = product_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(product, key, value) # Gán giá trị mới vào object product

    # 4. Lưu thay đổi
    db.commit()
    db.refresh(product)
    
    return product