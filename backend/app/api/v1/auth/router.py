from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.core.security import create_access_token, verify_password
from app.dependencies.databae import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserRead
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(*, form_data: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == form_data.email).first()
    if user is None or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="কিছু একটা ভুল হয়েছে",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)


@router.post("/register", response_model=UserRead, status_code=201)
def register(*, user_in: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    logger.info(f"📥 BACKEND STEP 1: Register endpoint called with data: username={user_in.username}, email={user_in.email}")
    
    # Prevent duplicate username/email
    existing = db.query(User).filter((User.email == user_in.email) | (User.username == user_in.username)).first()
    if existing:
        logger.warning(f"❌ User already exists: {user_in.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with given email or username already exists")

    logger.info(f"📥 BACKEND STEP 2: Hashing password...")
    hashed = get_password_hash(user_in.password)
    
    logger.info(f"📥 BACKEND STEP 3: Creating user object...")
    new_user = User(username=user_in.username, email=user_in.email, password_hash=hashed)
    
    logger.info(f"📥 BACKEND STEP 4: Saving to database...")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"✅ BACKEND STEP 5: User created successfully with ID={new_user.id}")
    return new_user
