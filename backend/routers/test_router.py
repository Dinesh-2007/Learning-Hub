from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from datetime import datetime
import models, schemas

router = APIRouter(prefix="/api/tests", tags=["Mock Tests"])


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


def _seed_missing_tests(db: Session):
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

    inserted = False
    for test_type, cfg in targets.items():
        existing = db.query(models.MockTest).filter(models.MockTest.test_type == test_type).count()
        missing = max(cfg["minimum"] - existing, 0)

        for idx in range(missing):
            difficulty = cfg["difficulty_cycle"][(existing + idx) % len(cfg["difficulty_cycle"])]
            test_number = existing + idx + 1
            test = models.MockTest(
                title=f"{cfg['title_prefix']} {test_number}",
                description=cfg["description"],
                test_type=test_type,
                subject=cfg["subject"],
                difficulty=difficulty,
                duration_minutes=cfg["duration"],
                total_marks=cfg["marks"],
                questions=_build_default_questions(cfg["topic"]),
            )
            db.add(test)
            inserted = True

    if inserted:
        db.commit()


@router.get("/", response_model=list[schemas.MockTestOut])
def get_tests(test_type: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    _seed_missing_tests(db)
    q = db.query(models.MockTest)
    if test_type:
        q = q.filter(models.MockTest.test_type == test_type)
    return q.all()


@router.get("/{test_id}", response_model=schemas.MockTestOut)
def get_test(test_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    test = db.query(models.MockTest).filter(models.MockTest.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test


@router.post("/submit", response_model=schemas.TestSubmissionOut)
def submit_test(data: schemas.TestSubmissionCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    test = db.query(models.MockTest).filter(models.MockTest.id == data.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    
    # Calculate score
    questions = test.questions or []
    correct = 0
    total = len(questions)
    
    for q in questions:
        q_id = str(q.get("id", ""))
        user_answer = data.answers.get(q_id, "")
        if user_answer == q.get("correct_answer", ""):
            correct += 1
    
    score = (correct / total * test.total_marks) if total > 0 else 0
    accuracy = (correct / total * 100) if total > 0 else 0
    
    submission = models.TestSubmission(
        user_id=current_user.id,
        test_id=data.test_id,
        answers=data.answers,
        score=score,
        total_marks=test.total_marks,
        accuracy=accuracy,
        time_taken_minutes=data.time_taken_minutes,
        submitted_at=datetime.utcnow()
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.get("/submissions/history", response_model=list[schemas.TestSubmissionOut])
def get_submission_history(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.TestSubmission).filter(
        models.TestSubmission.user_id == current_user.id
    ).order_by(models.TestSubmission.submitted_at.desc()).all()
