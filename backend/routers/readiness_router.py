from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/api/readiness", tags=["Readiness Check-ins"])


@router.get("/", response_model=list[schemas.ReadinessOut])
def get_checkins(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.ReadinessCheckin).filter(
        models.ReadinessCheckin.user_id == current_user.id
    ).order_by(models.ReadinessCheckin.checked_at.desc()).all()


@router.post("/", response_model=schemas.ReadinessOut)
def create_checkin(data: schemas.ReadinessCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    checkin = models.ReadinessCheckin(
        user_id=current_user.id,
        subject=data.subject,
        confidence_level=max(1, min(5, data.confidence_level)),
        notes=data.notes
    )
    db.add(checkin)
    db.commit()
    db.refresh(checkin)
    return checkin


@router.get("/summary")
def get_readiness_summary(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    checkins = db.query(models.ReadinessCheckin).filter(
        models.ReadinessCheckin.user_id == current_user.id
    ).all()
    
    subject_confidence = {}
    for c in checkins:
        subject_confidence[c.subject] = c.confidence_level
    
    avg = sum(subject_confidence.values()) / len(subject_confidence) if subject_confidence else 0
    
    return {
        "overall_readiness": round(avg, 1),
        "subjects": [{"subject": s, "confidence": v} for s, v in subject_confidence.items()],
        "total_checkins": len(checkins)
    }
