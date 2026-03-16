from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from typing import Any

import schemas
from auth import get_current_user
from database import get_db, get_next_id

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


@router.get("/study-hours")
def get_study_hours(days: int = 30, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=days)
    logs = list(
        db.study_logs.find({"user_id": current_user["id"], "date": {"$gte": since}}).sort("date", 1)
    )

    return [
        {
            "date": log.get("date").isoformat(),
            "hours": log.get("hours_studied", 0),
            "tasks_completed": log.get("tasks_completed", 0),
        }
        for log in logs
    ]


@router.post("/log-study", response_model=schemas.StudyLogOut)
def log_study(data: schemas.StudyLogCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    log = {
        "id": get_next_id(db, "study_logs"),
        "user_id": current_user["id"],
        "date": datetime.utcnow(),
        "hours_studied": data.hours_studied,
        "subjects_covered": data.subjects_covered or [],
        "tasks_completed": data.tasks_completed or 0,
    }
    db.study_logs.insert_one(log)
    return log


@router.get("/activity-heatmap")
def get_activity_heatmap(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    since = datetime.utcnow() - timedelta(days=365)
    logs = list(db.study_logs.find({"user_id": current_user["id"], "date": {"$gte": since}}))

    heatmap = {}
    for log in logs:
        date_str = log["date"].strftime("%Y-%m-%d")
        heatmap.setdefault(date_str, 0)
        heatmap[date_str] += float(log.get("hours_studied", 0))

    return [{"date": date, "hours": round(hours, 1)} for date, hours in sorted(heatmap.items())]


@router.get("/dashboard-summary")
def get_dashboard_summary(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    today = datetime.utcnow().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())

    schedules = list(db.schedules.find({"user_id": current_user["id"]}))
    schedule_ids = [schedule["id"] for schedule in schedules]

    today_tasks = list(
        db.schedule_tasks.find(
            {
                "schedule_id": {"$in": schedule_ids},
                "date": {"$gte": today_start, "$lte": today_end},
            }
        )
    )

    upcoming_events = []
    now = datetime.utcnow()
    for schedule in schedules:
        exam_date = schedule.get("exam_date")
        interview_date = schedule.get("interview_date")
        if exam_date and exam_date > now:
            upcoming_events.append({"type": "exam", "title": schedule.get("title", ""), "date": exam_date.isoformat()})
        if interview_date and interview_date > now:
            upcoming_events.append(
                {"type": "interview", "title": schedule.get("title", ""), "date": interview_date.isoformat()}
            )

    upcoming_events.sort(key=lambda event: event["date"])

    subjects = list(db.subject_progress.find({"user_id": current_user["id"]}))
    total_topics = sum(int(subject.get("total_topics", 0)) for subject in subjects)
    completed_topics = sum(int(subject.get("completed_topics", 0)) for subject in subjects)

    streak = db.streaks.find_one({"user_id": current_user["id"]})

    week_ago = datetime.utcnow() - timedelta(days=7)
    week_logs = list(db.study_logs.find({"user_id": current_user["id"], "date": {"$gte": week_ago}}))
    weekly_hours = sum(float(log.get("hours_studied", 0)) for log in week_logs)

    tests_completed = db.test_submissions.count_documents({"user_id": current_user["id"]})
    resources_count = db.resources.count_documents({"user_id": current_user["id"]})

    return {
        "today_tasks": [
            {
                "id": task.get("id"),
                "title": task.get("title", ""),
                "subject": task.get("subject", ""),
                "is_completed": bool(task.get("is_completed", False)),
                "priority": task.get("priority", "medium"),
            }
            for task in today_tasks
        ],
        "upcoming_events": upcoming_events[:5],
        "completion_percentage": round((completed_topics / total_topics * 100) if total_topics > 0 else 0, 1),
        "total_topics": total_topics,
        "completed_topics": completed_topics,
        "current_streak": int((streak or {}).get("current_streak", 0)),
        "longest_streak": int((streak or {}).get("longest_streak", 0)),
        "total_points": int((streak or {}).get("total_points", 0)),
        "weekly_study_hours": round(weekly_hours, 1),
        "tests_completed": tests_completed,
        "resources_count": resources_count,
    }
