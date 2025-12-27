from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from ..models.Product import Product
from ..schemas.Product import ProductCreate, ProductOut, ProductUpdate
from .auth import get_current_user 

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