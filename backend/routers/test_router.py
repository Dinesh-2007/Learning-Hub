from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from datetime import datetime
import models, schemas

router = APIRouter(prefix="/api/tests", tags=["Mock Tests"])


@router.get("/", response_model=list[schemas.MockTestOut])
def get_tests(test_type: str = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
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
