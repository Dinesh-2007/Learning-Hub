"""Seed script to populate MongoDB with sample data for demonstration."""

from datetime import datetime, timedelta

from auth import get_password_hash
from database import db, get_next_id


def seed_database():
    if db.users.count_documents({}) > 0:
        print("Database already seeded!")
        return

    print("Seeding MongoDB...")

    now = datetime.utcnow()
    user_id = get_next_id(db, "users")
    db.users.insert_one(
        {
            "id": user_id,
            "username": "demo",
            "email": "demo@studyplatform.dev",
            "hashed_password": get_password_hash("password123"),
            "full_name": "Demo User",
            "avatar_url": "",
            "created_at": now,
        }
    )

    db.streaks.insert_one(
        {
            "id": get_next_id(db, "streaks"),
            "user_id": user_id,
            "current_streak": 4,
            "longest_streak": 9,
            "total_points": 120,
            "last_activity_date": now - timedelta(days=1),
        }
    )

    db.notifications.insert_many(
        [
            {
                "id": get_next_id(db, "notifications"),
                "user_id": user_id,
                "title": "Welcome to StudyPlatform!",
                "message": "Start by creating a study schedule.",
                "notification_type": "info",
                "is_read": False,
                "created_at": now,
            },
            {
                "id": get_next_id(db, "notifications"),
                "user_id": user_id,
                "title": "Daily Goal Reminder",
                "message": "Complete at least 2 tasks today.",
                "notification_type": "reminder",
                "is_read": False,
                "created_at": now - timedelta(hours=6),
            },
        ]
    )

    schedule_id = get_next_id(db, "schedules")
    db.schedules.insert_one(
        {
            "id": schedule_id,
            "user_id": user_id,
            "title": "Placement Preparation Plan",
            "exam_date": now + timedelta(days=30),
            "interview_date": now + timedelta(days=45),
            "hours_per_day": 4.0,
            "priority_subjects": ["DSA", "DBMS", "OS"],
            "created_at": now,
        }
    )

    db.schedule_tasks.insert_many(
        [
            {
                "id": get_next_id(db, "schedule_tasks"),
                "schedule_id": schedule_id,
                "title": "Revise Arrays and Strings",
                "description": "Solve 5 medium problems",
                "subject": "DSA",
                "date": now + timedelta(days=1),
                "duration_hours": 1.5,
                "is_completed": False,
                "priority": "high",
            },
            {
                "id": get_next_id(db, "schedule_tasks"),
                "schedule_id": schedule_id,
                "title": "DBMS Normalization",
                "description": "Prepare concise notes",
                "subject": "DBMS",
                "date": now + timedelta(days=2),
                "duration_hours": 1.0,
                "is_completed": True,
                "priority": "medium",
            },
        ]
    )

    db.resources.insert_many(
        [
            {
                "id": get_next_id(db, "resources"),
                "user_id": user_id,
                "title": "Top 75 DSA Questions",
                "description": "Curated DSA question list",
                "resource_type": "link",
                "category": "practice",
                "subject": "DSA",
                "url": "https://leetcode.com/studyplan/top-interview-150/",
                "file_path": "",
                "tags": ["dsa", "leetcode"],
                "created_at": now,
            },
            {
                "id": get_next_id(db, "resources"),
                "user_id": user_id,
                "title": "DBMS Cheatsheet",
                "description": "Quick revision handout",
                "resource_type": "notes",
                "category": "revision",
                "subject": "DBMS",
                "url": "",
                "file_path": "",
                "tags": ["dbms", "revision"],
                "created_at": now,
            },
        ]
    )

    db.notes.insert_one(
        {
            "id": get_next_id(db, "notes"),
            "user_id": user_id,
            "title": "OS Process States",
            "content": "New -> Ready -> Running -> Waiting -> Terminated",
            "subject": "OS",
            "tags": ["os", "process"],
            "is_bookmarked": True,
            "is_revision": True,
            "created_at": now,
            "updated_at": now,
        }
    )

    subject_progress_id = get_next_id(db, "subject_progress")
    db.subject_progress.insert_one(
        {
            "id": subject_progress_id,
            "user_id": user_id,
            "subject": "DSA",
            "total_topics": 5,
            "completed_topics": 2,
            "target_date": now + timedelta(days=20),
        }
    )
    db.topic_progress.insert_many(
        [
            {
                "id": get_next_id(db, "topic_progress"),
                "subject_progress_id": subject_progress_id,
                "topic_name": "Arrays",
                "status": "mastered",
                "notes": "",
            },
            {
                "id": get_next_id(db, "topic_progress"),
                "subject_progress_id": subject_progress_id,
                "topic_name": "Binary Search",
                "status": "mastered",
                "notes": "",
            },
            {
                "id": get_next_id(db, "topic_progress"),
                "subject_progress_id": subject_progress_id,
                "topic_name": "Graphs",
                "status": "in_progress",
                "notes": "",
            },
        ]
    )

    mock_test_ids = []
    for test_type, subject, title in [
        ("subject", "Core Subjects", "Subject Mastery Test"),
        ("aptitude", "Aptitude", "Aptitude Sprint"),
        ("coding", "DSA", "Coding Challenge"),
    ]:
        for i in range(1, 5):
            test_id = get_next_id(db, "mock_tests")
            mock_test_ids.append(test_id)
            db.mock_tests.insert_one(
                {
                    "id": test_id,
                    "title": f"{title} {i}",
                    "description": "Generated sample test",
                    "test_type": test_type,
                    "subject": subject,
                    "difficulty": "medium",
                    "duration_minutes": 30,
                    "total_marks": 50,
                    "questions": [
                        {
                            "id": 1,
                            "question": "Sample question",
                            "options": ["A", "B", "C", "D"],
                            "correct_answer": "A",
                        }
                    ],
                }
            )

    db.test_submissions.insert_one(
        {
            "id": get_next_id(db, "test_submissions"),
            "user_id": user_id,
            "test_id": mock_test_ids[0],
            "answers": {"1": "A"},
            "score": 45.0,
            "total_marks": 50.0,
            "accuracy": 90.0,
            "time_taken_minutes": 22.0,
            "submitted_at": now - timedelta(days=1),
        }
    )

    db.readiness_checkins.insert_one(
        {
            "id": get_next_id(db, "readiness_checkins"),
            "user_id": user_id,
            "subject": "DSA",
            "confidence_level": 4,
            "notes": "Need more graph practice",
            "checked_at": now,
        }
    )

    db.study_logs.insert_many(
        [
            {
                "id": get_next_id(db, "study_logs"),
                "user_id": user_id,
                "date": now - timedelta(days=2),
                "hours_studied": 3.5,
                "subjects_covered": ["DSA", "DBMS"],
                "tasks_completed": 2,
            },
            {
                "id": get_next_id(db, "study_logs"),
                "user_id": user_id,
                "date": now - timedelta(days=1),
                "hours_studied": 2.0,
                "subjects_covered": ["OS"],
                "tasks_completed": 1,
            },
        ]
    )

    print("Seed complete.")


if __name__ == "__main__":
    seed_database()
