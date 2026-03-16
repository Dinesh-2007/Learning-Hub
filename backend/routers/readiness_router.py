from fastapi import APIRouter, Depends
from typing import Any
from datetime import datetime

import schemas
from auth import get_current_user
from database import get_db, get_next_id

router = APIRouter(prefix="/api/readiness", tags=["Readiness Check-ins"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


@router.get("/", response_model=list[schemas.ReadinessOut])
def get_checkins(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    checkins = list(db.readiness_checkins.find({"user_id": current_user["id"]}).sort("checked_at", -1))
    return [_clean(checkin) for checkin in checkins]


@router.post("/", response_model=schemas.ReadinessOut)
def create_checkin(data: schemas.ReadinessCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    checkin = {
        "id": get_next_id(db, "readiness_checkins"),
        "user_id": current_user["id"],
        "subject": data.subject,
        "confidence_level": max(1, min(5, data.confidence_level)),
        "notes": data.notes or "",
        "checked_at": datetime.utcnow(),
    }
    db.readiness_checkins.insert_one(checkin)
    return checkin


@router.get("/summary")
def get_readiness_summary(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    checkins = list(db.readiness_checkins.find({"user_id": current_user["id"]}))

    subject_confidence = {}
    for checkin in checkins:
        subject = checkin.get("subject", "")
        if subject:
            subject_confidence[subject] = int(checkin.get("confidence_level", 0))

    avg = sum(subject_confidence.values()) / len(subject_confidence) if subject_confidence else 0

    return {
        "overall_readiness": round(avg, 1),
        "subjects": [{"subject": subject, "confidence": confidence} for subject, confidence in subject_confidence.items()],
        "total_checkins": len(checkins),
    }
