from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.cart import Cart, CartDetail
from ..models.product import Product
from ..models.user import User
from ..schemas.cart import CartCreate, CartResponse, CartItemCreate
from ..routers.auth import get_current_user # Lấy user từ token

router = APIRouter(prefix="/cart", tags=["Cart"])

# 1. Lấy giỏ hàng của User đang đăng nhập
@router.get("/", response_model=CartResponse)
def get_my_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    
    # Nếu chưa có giỏ thì tạo mới giỏ rỗng trả về
    if not cart:
        new_cart = Cart(user_id=current_user.id)
        db.add(new_cart)
        db.commit()
        db.refresh(new_cart)
        return new_cart
        
    return cart

# 2. Thêm sản phẩm vào giỏ
@router.post("/add")
def add_to_cart(
    cart_item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Tìm giỏ hàng của user
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    # Kiểm tra sản phẩm có tồn tại không
    product = db.query(Product).filter(Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Kiểm tra xem món này đã có trong giỏ chưa
    cart_detail = db.query(CartDetail).filter(
        CartDetail.cart_id == cart.id,
        CartDetail.product_id == cart_item.product_id
    ).first()

    if cart_detail:
        # Nếu có rồi thì cộng thêm số lượng
        cart_detail.quantity += cart_item.quantity
    else:
        # Nếu chưa có thì tạo dòng mới
        # Lưu ý: Lấy giá hiện tại của sản phẩm để lưu vào
        cart_detail = CartDetail(
            cart_id=cart.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=product.price 
        )
        db.add(cart_detail)

    db.commit()
    return {"message": "Item added to cart"}

# 3. Xóa món khỏi giỏ
@router.delete("/remove/{product_id}")
def remove_from_cart(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_detail = db.query(CartDetail).filter(
        CartDetail.cart_id == cart.id,
        CartDetail.product_id == product_id
    ).first()

    if not cart_detail:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(cart_detail)
    db.commit()
    return {"message": "Item removed from cart"}