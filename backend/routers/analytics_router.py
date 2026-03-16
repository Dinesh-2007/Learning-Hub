from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from datetime import datetime, timedelta
import models, schemas

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/study-hours")
def get_study_hours(days: int = 30, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=days)
    logs = db.query(models.StudyLog).filter(
        models.StudyLog.user_id == current_user.id,
        models.StudyLog.date >= since
    ).order_by(models.StudyLog.date).all()
    
    return [
        {"date": l.date.isoformat(), "hours": l.hours_studied, "tasks_completed": l.tasks_completed}
        for l in logs
    ]


@router.post("/log-study", response_model=schemas.StudyLogOut)
def log_study(data: schemas.StudyLogCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    log = models.StudyLog(
        user_id=current_user.id,
        hours_studied=data.hours_studied,
        subjects_covered=data.subjects_covered,
        tasks_completed=data.tasks_completed
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get("/activity-heatmap")
def get_activity_heatmap(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=365)
    logs = db.query(models.StudyLog).filter(
        models.StudyLog.user_id == current_user.id,
        models.StudyLog.date >= since
    ).all()
    
    heatmap = {}
    for log in logs:
        date_str = log.date.strftime("%Y-%m-%d")
        if date_str not in heatmap:
            heatmap[date_str] = 0
        heatmap[date_str] += log.hours_studied
    
    return [{"date": k, "hours": round(v, 1)} for k, v in sorted(heatmap.items())]


@router.get("/dashboard-summary")
def get_dashboard_summary(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Today's tasks
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    today_tasks = db.query(models.ScheduleTask).join(models.StudySchedule).filter(
        models.StudySchedule.user_id == current_user.id,
        models.ScheduleTask.date >= today_start,
        models.ScheduleTask.date <= today_end
    ).all()
    
    # Upcoming events
    upcoming_schedules = db.query(models.StudySchedule).filter(
        models.StudySchedule.user_id == current_user.id
    ).all()
    
    upcoming_events = []
    for s in upcoming_schedules:
        if s.exam_date and s.exam_date > datetime.utcnow():
            upcoming_events.append({"type": "exam", "title": s.title, "date": s.exam_date.isoformat()})
        if s.interview_date and s.interview_date > datetime.utcnow():
            upcoming_events.append({"type": "interview", "title": s.title, "date": s.interview_date.isoformat()})
    
    upcoming_events.sort(key=lambda x: x["date"])
    
    # Progress summary
    subjects = db.query(models.SubjectProgress).filter(models.SubjectProgress.user_id == current_user.id).all()
    total_topics = sum(s.total_topics for s in subjects)
    completed_topics = sum(s.completed_topics for s in subjects)
    
    # Streak
    streak = db.query(models.Streak).filter(models.Streak.user_id == current_user.id).first()
    
    # Recent study hours
    week_ago = datetime.utcnow() - timedelta(days=7)
    week_logs = db.query(models.StudyLog).filter(
        models.StudyLog.user_id == current_user.id,
        models.StudyLog.date >= week_ago
    ).all()
    weekly_hours = sum(l.hours_studied for l in week_logs)
    
    tests_completed = db.query(models.TestSubmission).filter(models.TestSubmission.user_id == current_user.id).count()
    resources_count = db.query(models.Resource).filter(models.Resource.user_id == current_user.id).count()
    
    return {
        "today_tasks": [{"id": t.id, "title": t.title, "subject": t.subject, "is_completed": t.is_completed, "priority": t.priority} for t in today_tasks],
        "upcoming_events": upcoming_events[:5],
        "completion_percentage": round((completed_topics / total_topics * 100) if total_topics > 0 else 0, 1),
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "current_streak": streak.current_streak if streak else 0,
        "longest_streak": streak.longest_streak if streak else 0,
        "total_points": streak.total_points if streak else 0,
        "weekly_study_hours": round(weekly_hours, 1),
        "tests_completed": tests_completed,
        "resources_count": resources_count
    }
