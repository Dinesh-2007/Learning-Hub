from fastapi import APIRouter, Depends, HTTPException
from typing import Any

import schemas
from auth import get_current_user
from database import get_db, get_next_id

router = APIRouter(prefix="/api/progress", tags=["Progress Tracking"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


def _build_subject_progress(db: Any, subject_doc: dict) -> dict:
    subject = _clean(subject_doc)
    topics = [
        _clean(topic)
        for topic in db.topic_progress.find({"subject_progress_id": subject["id"]}).sort("id", 1)
    ]
    subject["topics"] = topics
    return subject


@router.get("/", response_model=list[schemas.SubjectProgressOut])
def get_all_progress(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    subjects = list(db.subject_progress.find({"user_id": current_user["id"]}).sort("id", 1))
    return [_build_subject_progress(db, subject) for subject in subjects]


@router.post("/", response_model=schemas.SubjectProgressOut)
def create_subject_progress(data: schemas.SubjectProgressCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    subject_progress_id = get_next_id(db, "subject_progress")
    total_topics = data.total_topics or len(data.topics or [])

    subject_progress = {
        "id": subject_progress_id,
        "user_id": current_user["id"],
        "subject": data.subject,
        "total_topics": total_topics,
        "completed_topics": 0,
        "target_date": data.target_date,
    }
    db.subject_progress.insert_one(subject_progress)

    completed_topics = 0
    topics_to_insert = []
    for topic in data.topics or []:
        if topic.status == "mastered":
            completed_topics += 1
        topics_to_insert.append(
            {
                "id": get_next_id(db, "topic_progress"),
                "subject_progress_id": subject_progress_id,
                "topic_name": topic.topic_name,
                "status": topic.status or "not_started",
                "notes": "",
            }
        )

    if topics_to_insert:
        db.topic_progress.insert_many(topics_to_insert)

    if completed_topics:
        db.subject_progress.update_one(
            {"id": subject_progress_id},
            {"$set": {"completed_topics": completed_topics}},
        )
        subject_progress["completed_topics"] = completed_topics

    subject_progress["topics"] = topics_to_insert
    return subject_progress


@router.put("/topics/{topic_id}/status")
def update_topic_status(topic_id: int, status: str, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    topic = db.topic_progress.find_one({"id": topic_id})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    subject_progress = db.subject_progress.find_one(
        {"id": topic["subject_progress_id"], "user_id": current_user["id"]}
    )
    if not subject_progress:
        raise HTTPException(status_code=404, detail="Topic not found")

    old_status = topic.get("status", "not_started")
    db.topic_progress.update_one({"id": topic_id}, {"$set": {"status": status}})

    completed_topics = int(subject_progress.get("completed_topics", 0))
    if status == "mastered" and old_status != "mastered":
        completed_topics += 1
    elif old_status == "mastered" and status != "mastered":
        completed_topics = max(0, completed_topics - 1)

    db.subject_progress.update_one(
        {"id": subject_progress["id"]},
        {"$set": {"completed_topics": completed_topics}},
    )

    return {"id": topic_id, "status": status}


@router.get("/summary")
def get_progress_summary(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    subjects = list(db.subject_progress.find({"user_id": current_user["id"]}))
    total_topics = sum(int(subject.get("total_topics", 0)) for subject in subjects)
    completed = sum(int(subject.get("completed_topics", 0)) for subject in subjects)

    tests = db.test_submissions.count_documents({"user_id": current_user["id"]})
    resources = db.resources.count_documents({"user_id": current_user["id"]})

    completion = round((completed / total_topics * 100) if total_topics > 0 else 0, 1)
    return {
        "total_subjects": len(subjects),
        "total_topics": total_topics,
        "completed_topics": completed,
        "completion_percentage": completion,
        "tests_completed": tests,
        "resources_count": resources,
    }
