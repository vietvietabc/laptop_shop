from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from database import get_db
from ..models.User import User # Import này trả về class User
from ..schemas.User import UserCreate, UserOut, Token 
from ..utils.hashing import Hash, SECRET_KEY, ALGORITHM # Gộp chung import từ utils

router = APIRouter(tags=["Authentication"])

# --- API ĐĂNG KÝ ---
@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Check email trùng (Sửa User.User thành User)
    user_exist = db.query(User).filter(User.email == user_in.email).first()
    if user_exist:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")

    # 2. Hash pass và tạo user
    new_user = User(
        email=user_in.email,
        password=Hash.bcrypt(user_in.password),
        full_name=user_in.full_name,
        address=user_in.address,
        phone=user_in.phone,
        avatar=None, 
        role_id=2
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- API ĐĂNG NHẬP ---
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Tìm user
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # 2. Kiểm tra user và pass
    if not user or not Hash.verify(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng"
        )

    # 3. Tạo Token
    access_token = Hash.create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role_id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# --- DEPENDENCY LẤY USER HIỆN TẠI ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực người dùng",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Sửa User.User thành User
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user 

# --- CÁC API CẦN ĐĂNG NHẬP ---

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/products/create")
def create_product(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Kiểm tra quyền Admin (role_id = 1)
    if current_user.role_id != 1:
        raise HTTPException(status_code=403, detail="Bạn không có quyền Admin")
    
    return {"message": f"Chào Admin {current_user.full_name}, bạn có thể tạo sản phẩm."}