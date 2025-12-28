from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from database import get_db
from ..models.Cart import Cart
from ..schemas.Cart import CartOut
from ..models.CartDetail import CartDetail
from ..models.Product import Product
from .auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.post("/add")
def add_to_cart(product_id: int, quantity: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # 1. Kiểm tra sản phẩm có tồn tại không
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại")

    # 2. Tìm Cart của User (nếu chưa có thì tạo mới)
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id, sum=0)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    # 3. Kiểm tra xem sản phẩm này đã có trong CartDetail chưa
    detail = db.query(CartDetail).filter(
        CartDetail.cart_id == cart.id, 
        CartDetail.product_id == product_id
    ).first()

    if detail:
        # Nếu có rồi thì tăng số lượng
        detail.quantity += quantity
    else:
        # Nếu chưa có thì tạo mới Detail
        detail = CartDetail(
            cart_id=cart.id, 
            product_id=product_id, 
            quantity=quantity, 
            price=product.price
        )
        db.add(detail)

    # 4. Cập nhật tổng tiền (sum) của Cart
    cart.sum += (product.price * quantity)
    
    db.commit()
    return {"message": "Thêm vào giỏ hàng thành công", "current_sum": cart.sum}

@router.get("/me", response_model=CartOut) 
def get_my_cart(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    cart = db.query(Cart).options(joinedload(Cart.cart_details))\
             .filter(Cart.user_id == current_user.id).first()
    
    if not cart:
        return {"id": 0, "sum": 0, "user_id": current_user.id, "cart_details": []}
        
    return cart 