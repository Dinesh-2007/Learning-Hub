from datetime import datetime, timedelta
from typing import Any

from database import get_next_id


def _insert_resource_if_missing(db: Any, user_id: int, now: datetime, title: str, description: str, resource_type: str, category: str, subject: str, url: str, tags: list[str]) -> None:
    exists = db.resources.find_one({"user_id": user_id, "title": title})
    if exists:
        return
    db.resources.insert_one(
        {
            "id": get_next_id(db, "resources"),
            "user_id": user_id,
            "title": title,
            "description": description,
            "resource_type": resource_type,
            "category": category,
            "subject": subject,
            "url": url,
            "file_path": "",
            "tags": tags,
            "created_at": now,
        }
    )


def _insert_note_if_missing(db: Any, user_id: int, now: datetime, title: str, content: str, subject: str, tags: list[str], bookmarked: bool) -> None:
    exists = db.notes.find_one({"user_id": user_id, "title": title})
    if exists:
        return
    db.notes.insert_one(
        {
            "id": get_next_id(db, "notes"),
            "user_id": user_id,
            "title": title,
            "content": content,
            "subject": subject,
            "tags": tags,
            "is_bookmarked": bookmarked,
            "is_revision": True,
            "created_at": now,
            "updated_at": now,
        }
    )


def ensure_user_starter_data(db: Any, user_id: int) -> None:
    now = datetime.utcnow()

    resources = [
        ("Data Structures Notes", "Comprehensive DS notes", "link", "notes", "Data Structures", "https://www.geeksforgeeks.org/data-structures/", ["ds", "algorithms"]),
        ("LeetCode - Top 100", "Must-do coding problems", "link", "coding", "DSA", "https://leetcode.com/problemset/", ["leetcode", "coding"]),
        ("DBMS Complete Guide", "Database management system notes", "link", "notes", "DBMS", "https://www.javatpoint.com/dbms-tutorial", ["dbms", "sql"]),
        ("Aptitude Practice Set", "Quantitative aptitude problems", "link", "aptitude", "Aptitude", "https://www.indiabix.com/", ["quantitative", "aptitude"]),
        ("OS Concepts", "Operating systems study material", "link", "notes", "Operating Systems", "https://www.tutorialspoint.com/operating_system/", ["os", "processes"]),
        ("System Design Primer", "System design interview prep", "link", "interview", "System Design", "https://github.com/donnemartin/system-design-primer", ["system-design", "interview"]),
        ("HackerRank Challenges", "Coding challenges platform", "link", "coding", "DSA", "https://www.hackerrank.com/", ["hackerrank", "practice"]),
        ("CN Fundamentals", "Computer Networks basics", "link", "notes", "Computer Networks", "https://www.geeksforgeeks.org/computer-network-tutorials/", ["networking", "protocols"]),
        ("Interview Communication Guide", "Common HR interview communication patterns", "link", "general", "Interview", "https://www.indeed.com/career-advice/interviewing", ["hr", "communication"]),
    ]
    for row in resources:
        _insert_resource_if_missing(db, user_id, now, *row)

    notes = [
        (
            "Binary Search Notes",
            "## Binary Search\n\n- Works on sorted arrays\n- Time: O(log n)\n- Divide and conquer approach",
            "Data Structures",
            ["binary-search", "algorithms"],
            True,
        ),
        (
            "SQL Cheatsheet",
            "## SQL Quick Reference\n\n- SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY\n- JOINs: INNER, LEFT, RIGHT, FULL",
            "DBMS",
            ["sql", "reference"],
            True,
        ),
        (
            "OS Process States",
            "## Process States\n\n1. New -> Ready\n2. Ready -> Running\n3. Running -> Waiting\n4. Running -> Terminated",
            "Operating Systems",
            ["processes", "os"],
            False,
        ),
    ]
    for row in notes:
        _insert_note_if_missing(db, user_id, now, *row)

    if db.schedules.count_documents({"user_id": user_id}) == 0:
        schedule1_id = get_next_id(db, "schedules")
        db.schedules.insert_one(
            {
                "id": schedule1_id,
                "user_id": user_id,
                "title": "Mid-Semester Exam Prep",
                "exam_date": now + timedelta(days=21),
                "interview_date": None,
                "hours_per_day": 5.0,
                "priority_subjects": ["Data Structures", "DBMS"],
                "created_at": now,
            }
        )
        subjects = ["Data Structures", "DBMS", "Operating Systems", "Computer Networks", "Aptitude"]
        for i in range(14):
            subject = subjects[i % len(subjects)]
            db.schedule_tasks.insert_one(
                {
                    "id": get_next_id(db, "schedule_tasks"),
                    "schedule_id": schedule1_id,
                    "title": f"Study {subject} - Chapter {(i // len(subjects)) + 1}",
                    "description": f"Cover core concepts of {subject}",
                    "subject": subject,
                    "date": now + timedelta(days=i),
                    "duration_hours": 2.0,
                    "is_completed": i < 5,
                    "priority": "high" if subject in ["Data Structures", "DBMS"] else "medium",
                }
            )

    if db.subject_progress.count_documents({"user_id": user_id}) == 0:
        progress_data = [
            ("Data Structures", [("Arrays", "mastered"), ("Linked Lists", "mastered"), ("Trees", "practicing"), ("Graphs", "learning"), ("Dynamic Programming", "not_started"), ("Hashing", "mastered")]),
            ("DBMS", [("ER Model", "mastered"), ("Normalization", "practicing"), ("SQL Queries", "mastered"), ("Transactions", "learning"), ("Indexing", "not_started")]),
        ]
        for subject, topics in progress_data:
            completed = sum(1 for _, status in topics if status == "mastered")
            subject_progress_id = get_next_id(db, "subject_progress")
            db.subject_progress.insert_one(
                {
                    "id": subject_progress_id,
                    "user_id": user_id,
                    "subject": subject,
                    "total_topics": len(topics),
                    "completed_topics": completed,
                    "target_date": now + timedelta(days=30),
                }
            )
            for topic_name, status in topics:
                db.topic_progress.insert_one(
                    {
                        "id": get_next_id(db, "topic_progress"),
                        "subject_progress_id": subject_progress_id,
                        "topic_name": topic_name,
                        "status": status,
                        "notes": "",
                    }
                )

    readiness_templates = [
        (14, "Data Structures", 3, "Covered arrays and strings; need better speed in two-pointer problems."),
        (12, "DBMS", 2, "Revise ACID properties and conflict serializability with examples."),
        (10, "Operating Systems", 2, "Memory management and paging still feel weak under timed recall."),
        (9, "Aptitude", 3, "Good at percentages; improve permutations and combinations accuracy."),
        (8, "Computer Networks", 2, "Need revision on TCP congestion control and subnetting drills."),
        (6, "Data Structures", 4, "Solved 20 medium-level problems; graph traversal confidence improved."),
        (5, "DBMS", 3, "Join optimization and indexing concepts are clearer after practice."),
        (4, "Operating Systems", 3, "Process synchronization improved after revising semaphores and monitors."),
        (3, "Aptitude", 4, "Time-per-question improved on arithmetic and ratio sets."),
        (2, "Computer Networks", 3, "OSI/TCP-IP mapping and protocol layering now mostly comfortable."),
        (1, "System Design", 2, "Started high-level design prep; need better component trade-off reasoning."),
        (0, "Interview", 3, "Communication improved in mock sessions; tighten STAR structure in responses."),
    ]

    existing_checkins = list(
        db.readiness_checkins.find(
            {"user_id": user_id},
            {"_id": 0, "subject": 1, "confidence_level": 1, "notes": 1},
        )
    )
    existing_signatures = {
        (
            checkin.get("subject", ""),
            int(checkin.get("confidence_level", 0)),
            checkin.get("notes", ""),
        )
        for checkin in existing_checkins
    }

    # Keep seeded readiness data rich enough for realistic dashboards.
    if len(existing_checkins) < 10:
        for days_ago, subject, confidence, notes in readiness_templates:
            signature = (subject, confidence, notes)
            if signature in existing_signatures:
                continue

            db.readiness_checkins.insert_one(
                {
                    "id": get_next_id(db, "readiness_checkins"),
                    "user_id": user_id,
                    "subject": subject,
                    "confidence_level": confidence,
                    "notes": notes,
                    "checked_at": now - timedelta(days=days_ago),
                }
            )
            existing_signatures.add(signature)

    if db.study_logs.count_documents({"user_id": user_id}) == 0:
        for i in range(7):
            db.study_logs.insert_one(
                {
                    "id": get_next_id(db, "study_logs"),
                    "user_id": user_id,
                    "date": now - timedelta(days=i),
                    "hours_studied": round(1.5 + (i % 4) * 0.8, 1),
                    "subjects_covered": ["Data Structures", "DBMS"] if i % 2 == 0 else ["Operating Systems", "Aptitude"],
                    "tasks_completed": 1 + (i % 3),
                }
            )

    if db.notifications.count_documents({"user_id": user_id}) == 0:
        notifications = [
            ("Welcome to StudyPlatform", "Start by creating a study schedule or exploring resources.", "info"),
            ("Exam in 3 weeks", "Your Mid-Semester Exam is approaching. Stay on track.", "alert"),
            ("Daily Reminder", "Do not forget to complete today's study tasks.", "reminder"),
        ]
        for title, message, ntype in notifications:
            db.notifications.insert_one(
                {
                    "id": get_next_id(db, "notifications"),
                    "user_id": user_id,
                    "title": title,
                    "message": message,
                    "notification_type": ntype,
                    "is_read": False,
                    "created_at": now,
                }
            )

    if db.streaks.count_documents({"user_id": user_id}) == 0:
        db.streaks.insert_one(
            {
                "id": get_next_id(db, "streaks"),
                "user_id": user_id,
                "current_streak": 12,
                "longest_streak": 25,
                "total_points": 340,
                "last_activity_date": now,
            }
        )

    badge_defs = [
        ("First Steps", "Complete your first study session", "target"),
        ("7-Day Warrior", "Maintained a 7-day study streak", "fire"),
        ("Problem Solver", "Solved 10 practice problems", "lightbulb"),
        ("Test Taker", "Complete your first mock test", "file-text"),
        ("Resource Collector", "Upload 5 study resources", "book"),
        ("Monthly Master", "Maintained a 30-day study streak", "trophy"),
        ("Mock Test Master", "Score above 80% in 3 tests", "star"),
    ]
    for name, description, icon in badge_defs:
        if not db.badges.find_one({"name": name}):
            db.badges.insert_one(
                {
                    "id": get_next_id(db, "badges"),
                    "name": name,
                    "description": description,
                    "icon": icon,
                }
            )

    if db.user_badges.count_documents({"user_id": user_id}) == 0:
        first_four_badges = list(db.badges.find().sort("id", 1).limit(4))
        for badge in first_four_badges:
            db.user_badges.insert_one(
                {
                    "id": get_next_id(db, "user_badges"),
                    "user_id": user_id,
                    "badge_id": badge["id"],
                    "earned_at": now,
                }
            )
