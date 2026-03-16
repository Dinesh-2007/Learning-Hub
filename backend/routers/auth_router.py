from fastapi import APIRouter, Depends, HTTPException, status
from typing import Any
from database import get_db, get_next_id, now_utc
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from starter_data import ensure_user_starter_data
import schemas

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Any = Depends(get_db)):
    if db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = get_next_id(db, "users")
    db_user = {
        "id": user_id,
        "username": user.username,
        "email": user.email,
        "hashed_password": get_password_hash(user.password),
        "full_name": user.full_name or "",
        "avatar_url": "",
        "created_at": now_utc(),
    }
    db.users.insert_one(db_user)

    # Create initial streak record
    db.streaks.insert_one(
        {
            "id": get_next_id(db, "streaks"),
            "user_id": user_id,
            "current_streak": 0,
            "longest_streak": 0,
            "total_points": 0,
            "last_activity_date": None,
        }
    )

    # Welcome notification
    db.notifications.insert_one(
        {
            "id": get_next_id(db, "notifications"),
            "user_id": user_id,
            "title": "Welcome to StudyPlatform!",
            "message": "Start by creating a study schedule or uploading your first resource.",
            "notification_type": "info",
            "is_read": False,
            "created_at": now_utc(),
        }
    )

    ensure_user_starter_data(db, user_id)

    return db_user


@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Any = Depends(get_db)):
    db_user = db.users.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    ensure_user_starter_data(db, db_user["id"])
    
    token = create_access_token(data={"sub": db_user["username"]})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserOut)
def get_profile(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    ensure_user_starter_data(db, current_user["id"])
    return current_user
