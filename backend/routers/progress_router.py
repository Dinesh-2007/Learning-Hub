from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/api/progress", tags=["Progress Tracking"])


@router.get("/", response_model=list[schemas.SubjectProgressOut])
def get_all_progress(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.SubjectProgress).filter(models.SubjectProgress.user_id == current_user.id).all()


@router.post("/", response_model=schemas.SubjectProgressOut)
def create_subject_progress(data: schemas.SubjectProgressCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    sp = models.SubjectProgress(
        user_id=current_user.id,
        subject=data.subject,
        total_topics=data.total_topics or len(data.topics),
        target_date=data.target_date
    )
    db.add(sp)
    db.commit()
    db.refresh(sp)
    
    for t in (data.topics or []):
        topic = models.TopicProgress(subject_progress_id=sp.id, topic_name=t.topic_name, status=t.status)
        db.add(topic)
    db.commit()
    db.refresh(sp)
    return sp


@router.put("/topics/{topic_id}/status")
def update_topic_status(topic_id: int, status: str, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    topic = db.query(models.TopicProgress).join(models.SubjectProgress).filter(
        models.TopicProgress.id == topic_id,
        models.SubjectProgress.user_id == current_user.id
    ).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    old_status = topic.status
    topic.status = status
    
    # Update completed count
    sp = db.query(models.SubjectProgress).filter(models.SubjectProgress.id == topic.subject_progress_id).first()
    if status == "mastered" and old_status != "mastered":
        sp.completed_topics += 1
    elif old_status == "mastered" and status != "mastered":
        sp.completed_topics = max(0, sp.completed_topics - 1)
    
    db.commit()
    return {"id": topic.id, "status": topic.status}


@router.get("/summary")
def get_progress_summary(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    subjects = db.query(models.SubjectProgress).filter(models.SubjectProgress.user_id == current_user.id).all()
    total_topics = sum(s.total_topics for s in subjects)
    completed = sum(s.completed_topics for s in subjects)
    
    tests = db.query(models.TestSubmission).filter(models.TestSubmission.user_id == current_user.id).count()
    resources = db.query(models.Resource).filter(models.Resource.user_id == current_user.id).count()
    
    return {
        "total_subjects": len(subjects),
        "total_topics": total_topics,
        "completed_topics": completed,
        "completion_percentage": round((completed / total_topics * 100) if total_topics > 0 else 0, 1),
        "tests_completed": tests,
        "resources_count": resources
    }
