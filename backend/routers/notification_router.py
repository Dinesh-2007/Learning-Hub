from fastapi import APIRouter, Depends
from typing import Any

import schemas
from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


@router.get("/", response_model=list[schemas.NotificationOut])
def get_notifications(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    notifications = list(
        db.notifications.find({"user_id": current_user["id"]}).sort("created_at", -1).limit(50)
    )
    return [_clean(notification) for notification in notifications]


@router.get("/unread-count")
def get_unread_count(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    count = db.notifications.count_documents({"user_id": current_user["id"], "is_read": False})
    return {"count": count}


@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    db.notifications.update_one(
        {"id": notification_id, "user_id": current_user["id"]},
        {"$set": {"is_read": True}},
    )
    return {"message": "Marked as read"}


@router.put("/read-all")
def mark_all_read(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    db.notifications.update_many(
        {"user_id": current_user["id"], "is_read": False},
        {"$set": {"is_read": True}},
    )
    return {"message": "All notifications marked as read"}
