from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from typing import Any

import schemas
from auth import get_current_user
from database import get_db, get_next_id

router = APIRouter(prefix="/api/tests", tags=["Mock Tests"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


def _build_default_questions(topic: str):
    return [
        {
            "id": 1,
            "question": f"What is a key concept in {topic}?",
            "options": ["Fundamentals", "Random Guess", "No Concept", "Irrelevant"],
            "correct_answer": "Fundamentals",
        },
        {
            "id": 2,
            "question": f"Choose the best approach to improve in {topic}.",
            "options": ["Consistent practice", "Avoid practice", "Skip basics", "Memorize only"],
            "correct_answer": "Consistent practice",
        },
        {
            "id": 3,
            "question": f"In {topic}, which strategy helps accuracy most?",
            "options": ["Review mistakes", "Rush attempts", "Ignore timing", "Skip analysis"],
            "correct_answer": "Review mistakes",
        },
        {
            "id": 4,
            "question": f"A good test plan for {topic} should include:",
            "options": ["Timed practice", "No schedule", "No feedback", "Only easy tasks"],
            "correct_answer": "Timed practice",
        },
        {
            "id": 5,
            "question": f"Best way to retain {topic} concepts?",
            "options": ["Spaced revision", "One-time reading", "No notes", "Skip recap"],
            "correct_answer": "Spaced revision",
        },
    ]


def _seed_missing_tests(db: Any):
    """Guarantee minimum catalog size so each filter has enough cards."""
    targets = {
        "subject": {
            "minimum": 10,
            "subject": "Core Subjects",
            "title_prefix": "Subject Mastery Test",
            "description": "Mixed core-subject fundamentals and interview-oriented MCQs.",
            "difficulty_cycle": ["easy", "medium", "hard"],
            "duration": 25,
            "marks": 50,
            "topic": "Subject Fundamentals",
        },
        "aptitude": {
            "minimum": 10,
            "subject": "Aptitude",
            "title_prefix": "Aptitude Practice Test",
            "description": "Quantitative, logical reasoning, and verbal aptitude timed set.",
            "difficulty_cycle": ["easy", "medium", "medium", "hard"],
            "duration": 20,
            "marks": 40,
            "topic": "Aptitude",
        },
        "coding": {
            "minimum": 10,
            "subject": "DSA",
            "title_prefix": "Coding Challenge Set",
            "description": "Coding problem solving set with algorithmic and implementation focus.",
            "difficulty_cycle": ["medium", "hard", "easy"],
            "duration": 35,
            "marks": 60,
            "topic": "Coding",
        },
    }

    tests_to_insert = []
    for test_type, cfg in targets.items():
        existing = db.mock_tests.count_documents({"test_type": test_type})
        missing = max(cfg["minimum"] - existing, 0)

        for idx in range(missing):
            difficulty = cfg["difficulty_cycle"][(existing + idx) % len(cfg["difficulty_cycle"])]
            test_number = existing + idx + 1
            tests_to_insert.append(
                {
                    "id": get_next_id(db, "mock_tests"),
                    "title": f"{cfg['title_prefix']} {test_number}",
                    "description": cfg["description"],
                    "test_type": test_type,
                    "subject": cfg["subject"],
                    "difficulty": difficulty,
                    "duration_minutes": cfg["duration"],
                    "total_marks": cfg["marks"],
                    "questions": _build_default_questions(cfg["topic"]),
                }
            )

    if tests_to_insert:
        db.mock_tests.insert_many(tests_to_insert)


@router.get("/", response_model=list[schemas.MockTestOut])
def get_tests(test_type: str = None, db: Any = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _seed_missing_tests(db)
    query = {"test_type": test_type} if test_type else {}
    tests = list(db.mock_tests.find(query).sort("id", 1))
    return [_clean(test) for test in tests]


@router.get("/submissions/history", response_model=list[schemas.TestSubmissionOut])
def get_submission_history(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    submissions = list(
        db.test_submissions.find({"user_id": current_user["id"]}).sort("submitted_at", -1)
    )
    return [_clean(submission) for submission in submissions]


@router.get("/{test_id}", response_model=schemas.MockTestOut)
def get_test(test_id: int, db: Any = Depends(get_db), current_user: dict = Depends(get_current_user)):
    test = db.mock_tests.find_one({"id": test_id})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return _clean(test)


@router.post("/submit", response_model=schemas.TestSubmissionOut)
def submit_test(data: schemas.TestSubmissionCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    test = db.mock_tests.find_one({"id": data.test_id})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    questions = test.get("questions", []) or []
    correct = 0
    total = len(questions)

    for question in questions:
        question_id = str(question.get("id", ""))
        user_answer = data.answers.get(question_id, "")
        if user_answer == question.get("correct_answer", ""):
            correct += 1

    total_marks = float(test.get("total_marks", 0))
    score = (correct / total * total_marks) if total > 0 else 0
    accuracy = (correct / total * 100) if total > 0 else 0

    submission = {
        "id": get_next_id(db, "test_submissions"),
        "user_id": current_user["id"],
        "test_id": data.test_id,
        "answers": data.answers,
        "score": score,
        "total_marks": total_marks,
        "accuracy": accuracy,
        "time_taken_minutes": data.time_taken_minutes or 0,
        "submitted_at": datetime.utcnow(),
    }
    db.test_submissions.insert_one(submission)
    return submission
