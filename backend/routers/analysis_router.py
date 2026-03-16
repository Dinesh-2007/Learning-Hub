from fastapi import APIRouter, Depends
from typing import Any

from auth import get_current_user
from database import get_db

router = APIRouter(prefix="/api/analysis", tags=["Test Analysis"])


@router.get("/performance")
def get_performance(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    submissions = list(
        db.test_submissions.find({"user_id": current_user["id"]}).sort("submitted_at", 1)
    )

    if not submissions:
        return {
            "total_tests": 0,
            "average_score": 0,
            "average_accuracy": 0,
            "scores_over_time": [],
            "weak_areas": [],
        }

    avg_score = sum(float(submission.get("score", 0)) for submission in submissions) / len(submissions)
    avg_accuracy = sum(float(submission.get("accuracy", 0)) for submission in submissions) / len(submissions)

    scores_over_time = [
        {
            "date": submission["submitted_at"].isoformat(),
            "score": submission.get("score", 0),
            "accuracy": submission.get("accuracy", 0),
        }
        for submission in submissions
    ]

    test_scores: dict[str, list[float]] = {}
    for submission in submissions:
        test = db.mock_tests.find_one({"id": submission.get("test_id")})
        if test:
            subject = test.get("subject") or test.get("test_type")
            test_scores.setdefault(subject, []).append(float(submission.get("accuracy", 0)))

    weak_areas = [
        {"subject": subject, "avg_accuracy": round(sum(scores) / len(scores), 1)}
        for subject, scores in test_scores.items()
        if scores and (sum(scores) / len(scores) < 60)
    ]

    return {
        "total_tests": len(submissions),
        "average_score": round(avg_score, 1),
        "average_accuracy": round(avg_accuracy, 1),
        "scores_over_time": scores_over_time,
        "weak_areas": weak_areas,
        "best_score": max(float(submission.get("score", 0)) for submission in submissions),
        "recent_trend": "improving"
        if len(submissions) > 1 and float(submissions[-1].get("score", 0)) > float(submissions[0].get("score", 0))
        else "stable",
    }


@router.get("/subject-breakdown")
def get_subject_breakdown(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    submissions = list(db.test_submissions.find({"user_id": current_user["id"]}))

    breakdown: dict[str, dict] = {}
    for submission in submissions:
        test = db.mock_tests.find_one({"id": submission.get("test_id")})
        if test:
            key = test.get("subject") or test.get("test_type")
            if key not in breakdown:
                breakdown[key] = {"tests_taken": 0, "total_score": 0.0, "total_accuracy": 0.0}
            breakdown[key]["tests_taken"] += 1
            breakdown[key]["total_score"] += float(submission.get("score", 0))
            breakdown[key]["total_accuracy"] += float(submission.get("accuracy", 0))

    result = []
    for subject, data in breakdown.items():
        tests_taken = data["tests_taken"]
        result.append(
            {
                "subject": subject,
                "tests_taken": tests_taken,
                "avg_score": round(data["total_score"] / tests_taken, 1),
                "avg_accuracy": round(data["total_accuracy"] / tests_taken, 1),
            }
        )

    return result
