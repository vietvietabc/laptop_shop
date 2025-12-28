from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from ..models.Order import Order
from ..models.OrderDetail import OrderDetail
from ..models.Cart import Cart
from ..models.Product import Product
# Import đúng tên Schema bạn đã cung cấp
from ..schemas.Order import OrderCreate, OrderResponse 

from .auth import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

# --- 1. ĐẶT HÀNG (CHECKOUT) ---
@router.post("/", response_model=OrderResponse)
def place_order(
    order_in: OrderCreate, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 1. Lấy giỏ hàng
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart or not cart.cart_details:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống")

    # 2. LỌC SẢN PHẨM: Chỉ lấy những món có trong danh sách product_ids gửi lên
    # cart.cart_details là list các CartDetail trong DB
    selected_items = []
    order_total = 0
    
    # Duyệt qua từng món trong giỏ
    for item in cart.cart_details:
        if item.product_id in order_in.product_ids:
            selected_items.append(item)
            order_total += item.price * item.quantity

    # Nếu lọc xong mà không thấy món nào hợp lệ (hoặc khách gửi list rỗng)
    if not selected_items:
        raise HTTPException(status_code=400, detail="Vui lòng chọn ít nhất 1 sản phẩm để thanh toán")

    # 3. Tạo Order với tổng tiền của CÁC MÓN ĐÃ CHỌN
    new_order = Order(
        user_id=current_user.id,
        receiver_name=order_in.receiver_name,
        receiver_phone=order_in.receiver_phone,
        receiver_address=order_in.receiver_address,
        status="PENDING",
        total_price=order_total 
    )
    db.add(new_order)
    db.flush() 

    # 4. Xử lý các món ĐÃ CHỌN (Chuyển sang OrderDetail, Trừ kho, Xóa khỏi Cart)
    for cart_item in selected_items:
        # a. Tạo OrderDetail
        order_detail = OrderDetail(
            order_id=new_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.price
        )
        db.add(order_detail)

        # b. Trừ kho
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if product:
            if product.quantity < cart_item.quantity:
                db.rollback()
                raise HTTPException(status_code=400, detail=f"Sản phẩm {product.name} hết hàng")
            product.quantity -= cart_item.quantity
            product.sold += cart_item.quantity

        # c. Xóa món này khỏi CartDetail (Chỉ xóa món đã mua)
        db.delete(cart_item)

    # 5. CẬP NHẬT LẠI TỔNG TIỀN CỦA GIỎ HÀNG (Quan trọng)
    # Vì mình chỉ lấy đi một phần, nên tiền trong giỏ phải giảm đi
    cart.sum -= order_total
    
    # Nếu cart.sum < 0 (đề phòng lỗi làm tròn số) thì gán về 0
    if cart.sum < 0: 
        cart.sum = 0

    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("/all", response_model=list[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    # Kiểm tra quyền Admin (Giả sử role_id = 1 là Admin)
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem danh sách đơn hàng")
    
    # Lấy tất cả đơn hàng, sắp xếp đơn mới nhất lên đầu
    orders = db.query(Order).order_by(Order.id.desc()).all()
    return orders

# --- 4. (ADMIN) CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
@router.put("/{order_id}/status")
def update_order_status(
    order_id: int, 
    new_status: str, # Ví dụ: CONFIRMED, SHIPPING, DONE
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Chỉ Admin mới được duyệt đơn
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Bạn không có quyền duyệt đơn")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng")

    # Cập nhật trạng thái
    order.status = new_status
    db.commit()
    
    return {"message": "Cập nhật trạng thái thành công", "order_id": order.id, "status": new_status}