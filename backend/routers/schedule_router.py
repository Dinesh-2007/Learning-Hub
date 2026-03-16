from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from datetime import datetime, timedelta
import models, schemas

router = APIRouter(prefix="/api/schedules", tags=["Study Schedules"])


@router.get("/", response_model=list[schemas.ScheduleOut])
def get_schedules(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.StudySchedule).filter(models.StudySchedule.user_id == current_user.id).all()


@router.get("/{schedule_id}", response_model=schemas.ScheduleOut)
def get_schedule(schedule_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    schedule = db.query(models.StudySchedule).filter(
        models.StudySchedule.id == schedule_id, models.StudySchedule.user_id == current_user.id
    ).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.post("/", response_model=schemas.ScheduleOut)
def create_schedule(data: schemas.ScheduleCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    schedule = models.StudySchedule(
        user_id=current_user.id,
        title=data.title,
        exam_date=data.exam_date,
        interview_date=data.interview_date,
        hours_per_day=data.hours_per_day,
        priority_subjects=data.priority_subjects
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.post("/auto-generate", response_model=schemas.ScheduleOut)
def auto_generate_schedule(data: schemas.AutoScheduleRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Auto-generate a study schedule based on exam date and subjects."""
    today = datetime.utcnow()
    days_until_exam = max((data.exam_date - today).days, 1)
    
    schedule = models.StudySchedule(
        user_id=current_user.id,
        title=data.title,
        exam_date=data.exam_date,
        hours_per_day=data.hours_per_day,
        priority_subjects=data.priority_subjects or []
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    
    # Distribute subjects across available days
    all_subjects = data.subjects
    priority = data.priority_subjects or []
    
    # Weight priority subjects more heavily
    weighted_subjects = []
    for s in all_subjects:
        weight = 2 if s in priority else 1
        weighted_subjects.extend([s] * weight)
    
    for day_offset in range(min(days_until_exam, 90)):  # Max 90 days
        task_date = today + timedelta(days=day_offset)
        subject_idx = day_offset % len(weighted_subjects)
        subject = weighted_subjects[subject_idx]
        
        task = models.ScheduleTask(
            schedule_id=schedule.id,
            title=f"Study {subject}",
            description=f"Day {day_offset + 1}: Focus on {subject}",
            subject=subject,
            date=task_date,
            duration_hours=data.hours_per_day / max(len(set(all_subjects)), 1),
            priority="high" if subject in priority else "medium"
        )
        db.add(task)
    
    db.commit()
    db.refresh(schedule)
    return schedule


@router.put("/tasks/{task_id}/toggle")
def toggle_task(task_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(models.ScheduleTask).join(models.StudySchedule).filter(
        models.ScheduleTask.id == task_id,
        models.StudySchedule.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_completed = not task.is_completed
    db.commit()
    return {"id": task.id, "is_completed": task.is_completed}


@router.post("/{schedule_id}/tasks", response_model=schemas.ScheduleTaskOut)
def create_schedule_task(
    schedule_id: int,
    data: schemas.ScheduleTaskManualCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    schedule = db.query(models.StudySchedule).filter(
        models.StudySchedule.id == schedule_id,
        models.StudySchedule.user_id == current_user.id
    ).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    task = models.ScheduleTask(
        schedule_id=schedule.id,
        title=data.title,
        description=data.description,
        subject=data.subject,
        date=data.date,
        duration_hours=data.duration_hours,
        priority=(data.priority or "medium").lower()
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/tasks/{task_id}/reschedule")
def reschedule_task(
    task_id: int,
    data: schemas.ScheduleTaskReschedule,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(models.ScheduleTask).join(models.StudySchedule).filter(
        models.ScheduleTask.id == task_id,
        models.StudySchedule.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.date = data.date
    db.commit()
    return {"id": task.id, "date": task.date}


@router.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    data: schemas.ScheduleTaskUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(models.ScheduleTask).join(models.StudySchedule).filter(
        models.ScheduleTask.id == task_id,
        models.StudySchedule.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if data.priority is not None:
        task.priority = data.priority.lower()
    if data.is_completed is not None:
        task.is_completed = data.is_completed

    db.commit()
    return {"id": task.id, "priority": task.priority, "is_completed": task.is_completed}


@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    schedule = db.query(models.StudySchedule).filter(
        models.StudySchedule.id == schedule_id, models.StudySchedule.user_id == current_user.id
    ).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted"}
