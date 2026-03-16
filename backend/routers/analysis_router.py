from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models

router = APIRouter(prefix="/api/analysis", tags=["Test Analysis"])


@router.get("/performance")
def get_performance(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    submissions = db.query(models.TestSubmission).filter(
        models.TestSubmission.user_id == current_user.id
    ).order_by(models.TestSubmission.submitted_at).all()
    
    if not submissions:
        return {"total_tests": 0, "average_score": 0, "average_accuracy": 0, "scores_over_time": [], "weak_areas": []}
    
    avg_score = sum(s.score for s in submissions) / len(submissions)
    avg_accuracy = sum(s.accuracy for s in submissions) / len(submissions)
    
    scores_over_time = [
        {"date": s.submitted_at.isoformat(), "score": s.score, "accuracy": s.accuracy}
        for s in submissions
    ]
    
    # Detect weak areas by checking low-scoring tests
    test_scores = {}
    for s in submissions:
        test = db.query(models.MockTest).filter(models.MockTest.id == s.test_id).first()
        if test:
            subject = test.subject or test.test_type
            if subject not in test_scores:
                test_scores[subject] = []
            test_scores[subject].append(s.accuracy)
    
    weak_areas = [
        {"subject": subj, "avg_accuracy": round(sum(scores) / len(scores), 1)}
        for subj, scores in test_scores.items()
        if sum(scores) / len(scores) < 60
    ]
    
    return {
        "total_tests": len(submissions),
        "average_score": round(avg_score, 1),
        "average_accuracy": round(avg_accuracy, 1),
        "scores_over_time": scores_over_time,
        "weak_areas": weak_areas,
        "best_score": max(s.score for s in submissions),
        "recent_trend": "improving" if len(submissions) > 1 and submissions[-1].score > submissions[0].score else "stable"
    }


@router.get("/subject-breakdown")
def get_subject_breakdown(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    submissions = db.query(models.TestSubmission).filter(
        models.TestSubmission.user_id == current_user.id
    ).all()
    
    breakdown = {}
    for s in submissions:
        test = db.query(models.MockTest).filter(models.MockTest.id == s.test_id).first()
        if test:
            key = test.subject or test.test_type
            if key not in breakdown:
                breakdown[key] = {"tests_taken": 0, "total_score": 0, "total_accuracy": 0}
            breakdown[key]["tests_taken"] += 1
            breakdown[key]["total_score"] += s.score
            breakdown[key]["total_accuracy"] += s.accuracy
    
    result = []
    for subj, data in breakdown.items():
        result.append({
            "subject": subj,
            "tests_taken": data["tests_taken"],
            "avg_score": round(data["total_score"] / data["tests_taken"], 1),
            "avg_accuracy": round(data["total_accuracy"] / data["tests_taken"], 1)
        })
    
    return result
