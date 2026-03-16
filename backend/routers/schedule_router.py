from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from typing import Any

import schemas
from auth import get_current_user
from database import get_db, get_next_id, now_utc

router = APIRouter(prefix="/api/schedules", tags=["Study Schedules"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


def _attach_tasks(db: Any, schedules: list[dict]) -> list[dict]:
    if not schedules:
        return []
    schedule_ids = [s["id"] for s in schedules]
    tasks_by_schedule: dict[int, list[dict]] = {sid: [] for sid in schedule_ids}
    for task in db.schedule_tasks.find({"schedule_id": {"$in": schedule_ids}}).sort("date", 1):
        clean_task = _clean(task)
        tasks_by_schedule.setdefault(clean_task["schedule_id"], []).append(clean_task)

    result = []
    for schedule in schedules:
        clean_schedule = _clean(schedule)
        clean_schedule["tasks"] = tasks_by_schedule.get(clean_schedule["id"], [])
        result.append(clean_schedule)
    return result


@router.get("/", response_model=list[schemas.ScheduleOut])
def get_schedules(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    schedules = list(db.schedules.find({"user_id": current_user["id"]}).sort("created_at", -1))
    return _attach_tasks(db, schedules)


@router.get("/{schedule_id}", response_model=schemas.ScheduleOut)
def get_schedule(schedule_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    schedule = db.schedules.find_one({"id": schedule_id, "user_id": current_user["id"]})
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return _attach_tasks(db, [schedule])[0]


@router.post("/", response_model=schemas.ScheduleOut)
def create_schedule(data: schemas.ScheduleCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    schedule = {
        "id": get_next_id(db, "schedules"),
        "user_id": current_user["id"],
        "title": data.title,
        "exam_date": data.exam_date,
        "interview_date": data.interview_date,
        "hours_per_day": data.hours_per_day,
        "priority_subjects": data.priority_subjects or [],
        "created_at": now_utc(),
    }
    db.schedules.insert_one(schedule)
    schedule["tasks"] = []
    return schedule


@router.post("/auto-generate", response_model=schemas.ScheduleOut)
def auto_generate_schedule(data: schemas.AutoScheduleRequest, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    """Auto-generate a study schedule based on exam date and subjects."""
    today = datetime.utcnow()
    days_until_exam = max((data.exam_date - today).days, 1)

    schedule = {
        "id": get_next_id(db, "schedules"),
        "user_id": current_user["id"],
        "title": data.title,
        "exam_date": data.exam_date,
        "interview_date": None,
        "hours_per_day": data.hours_per_day,
        "priority_subjects": data.priority_subjects or [],
        "created_at": now_utc(),
    }
    db.schedules.insert_one(schedule)

    all_subjects = data.subjects or data.priority_subjects or ["General"]
    priority = data.priority_subjects or []

    weighted_subjects = []
    for subject in all_subjects:
        weight = 2 if subject in priority else 1
        weighted_subjects.extend([subject] * weight)

    total_unique_subjects = max(len(set(all_subjects)), 1)

    tasks = []
    for day_offset in range(min(days_until_exam, 90)):
        task_date = today + timedelta(days=day_offset)
        subject_idx = day_offset % len(weighted_subjects)
        subject = weighted_subjects[subject_idx]

        task = {
            "id": get_next_id(db, "schedule_tasks"),
            "schedule_id": schedule["id"],
            "title": f"Study {subject}",
            "description": f"Day {day_offset + 1}: Focus on {subject}",
            "subject": subject,
            "date": task_date,
            "duration_hours": data.hours_per_day / total_unique_subjects,
            "priority": "high" if subject in priority else "medium",
            "is_completed": False,
        }
        tasks.append(task)

    if tasks:
        db.schedule_tasks.insert_many(tasks)

    schedule["tasks"] = tasks
    return schedule


@router.put("/tasks/{task_id}/toggle")
def toggle_task(task_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    task = db.schedule_tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    schedule = db.schedules.find_one({"id": task["schedule_id"], "user_id": current_user["id"]})
    if not schedule:
        raise HTTPException(status_code=404, detail="Task not found")

    new_state = not bool(task.get("is_completed", False))
    db.schedule_tasks.update_one({"id": task_id}, {"$set": {"is_completed": new_state}})
    return {"id": task_id, "is_completed": new_state}


@router.post("/{schedule_id}/tasks", response_model=schemas.ScheduleTaskOut)
def create_schedule_task(
    schedule_id: int,
    data: schemas.ScheduleTaskManualCreate,
    current_user: dict = Depends(get_current_user),
    db: Any = Depends(get_db),
):
    schedule = db.schedules.find_one({"id": schedule_id, "user_id": current_user["id"]})
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    task = {
        "id": get_next_id(db, "schedule_tasks"),
        "schedule_id": schedule_id,
        "title": data.title,
        "description": data.description or "",
        "subject": data.subject or "",
        "date": data.date,
        "duration_hours": data.duration_hours or 1.0,
        "priority": (data.priority or "medium").lower(),
        "is_completed": False,
    }
    db.schedule_tasks.insert_one(task)
    return task


@router.put("/tasks/{task_id}/reschedule")
def reschedule_task(
    task_id: int,
    data: schemas.ScheduleTaskReschedule,
    current_user: dict = Depends(get_current_user),
    db: Any = Depends(get_db),
):
    task = db.schedule_tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    schedule = db.schedules.find_one({"id": task["schedule_id"], "user_id": current_user["id"]})
    if not schedule:
        raise HTTPException(status_code=404, detail="Task not found")

    db.schedule_tasks.update_one({"id": task_id}, {"$set": {"date": data.date}})
    return {"id": task_id, "date": data.date}


@router.put("/tasks/{task_id}")
def update_task(
    task_id: int,
    data: schemas.ScheduleTaskUpdate,
    current_user: dict = Depends(get_current_user),
    db: Any = Depends(get_db),
):
    task = db.schedule_tasks.find_one({"id": task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    schedule = db.schedules.find_one({"id": task["schedule_id"], "user_id": current_user["id"]})
    if not schedule:
        raise HTTPException(status_code=404, detail="Task not found")

    updates = {}
    if data.priority is not None:
        updates["priority"] = data.priority.lower()
    if data.is_completed is not None:
        updates["is_completed"] = data.is_completed

    if updates:
        db.schedule_tasks.update_one({"id": task_id}, {"$set": updates})

    updated = db.schedule_tasks.find_one({"id": task_id})
    clean = _clean(updated)
    return {"id": clean["id"], "priority": clean["priority"], "is_completed": clean["is_completed"]}


@router.delete("/{schedule_id}")
def delete_schedule(schedule_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    schedule = db.schedules.find_one({"id": schedule_id, "user_id": current_user["id"]})
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.schedule_tasks.delete_many({"schedule_id": schedule_id})
    db.schedules.delete_one({"id": schedule_id})
    return {"message": "Schedule deleted"}
