from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from typing import Any

from auth import get_current_user
from database import get_db, get_next_id

router = APIRouter(prefix="/api/gamification", tags=["Gamification"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


def _get_or_create_streak(db: Any, user_id: int) -> dict:
    streak = db.streaks.find_one({"user_id": user_id})
    if streak:
        return streak

    streak = {
        "id": get_next_id(db, "streaks"),
        "user_id": user_id,
        "current_streak": 0,
        "longest_streak": 0,
        "total_points": 0,
        "last_activity_date": None,
    }
    db.streaks.insert_one(streak)
    return streak


@router.get("/streak")
def get_streak(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    streak = _get_or_create_streak(db, current_user["id"])
    return _clean(streak)


@router.post("/log-activity")
def log_activity(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    streak = _get_or_create_streak(db, current_user["id"])

    today = datetime.utcnow().date()
    last_activity = streak.get("last_activity_date")
    last = last_activity.date() if last_activity else None

    if last == today:
        return {"message": "Already logged today", "current_streak": streak.get("current_streak", 0)}

    current_streak = int(streak.get("current_streak", 0))
    if last == today - timedelta(days=1):
        current_streak += 1
    else:
        current_streak = 1

    longest_streak = max(int(streak.get("longest_streak", 0)), current_streak)
    total_points = int(streak.get("total_points", 0)) + 10

    db.streaks.update_one(
        {"user_id": current_user["id"]},
        {
            "$set": {
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "total_points": total_points,
                "last_activity_date": datetime.utcnow(),
            }
        },
    )

    _check_badges(current_user["id"], current_streak, db)
    return {"current_streak": current_streak, "points": total_points}


def _check_badges(user_id: int, current_streak: int, db: Any):
    badges_to_check = [
        (7, "7-Day Warrior", "fire", "Maintained a 7-day study streak"),
        (30, "Monthly Master", "trophy", "Maintained a 30-day study streak"),
    ]
    for days, name, icon, description in badges_to_check:
        if current_streak < days:
            continue

        badge = db.badges.find_one({"name": name})
        if not badge:
            badge = {
                "id": get_next_id(db, "badges"),
                "name": name,
                "description": description,
                "icon": icon,
            }
            db.badges.insert_one(badge)

        existing = db.user_badges.find_one({"user_id": user_id, "badge_id": badge["id"]})
        if not existing:
            db.user_badges.insert_one(
                {
                    "id": get_next_id(db, "user_badges"),
                    "user_id": user_id,
                    "badge_id": badge["id"],
                    "earned_at": datetime.utcnow(),
                }
            )


@router.get("/badges")
def get_badges(current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    user_badges = list(db.user_badges.find({"user_id": current_user["id"]}))
    all_badges = list(db.badges.find())

    earned_map = {ub["badge_id"]: ub.get("earned_at") for ub in user_badges}
    result = []
    for badge in all_badges:
        clean_badge = _clean(badge)
        badge_id = clean_badge["id"]
        result.append(
            {
                "id": badge_id,
                "name": clean_badge["name"],
                "description": clean_badge.get("description", ""),
                "icon": clean_badge.get("icon", ""),
                "earned": badge_id in earned_map,
                "earned_at": earned_map.get(badge_id),
            }
        )
    return result


@router.get("/leaderboard")
def get_leaderboard(db: Any = Depends(get_db), current_user: dict = Depends(get_current_user)):
    streaks = list(db.streaks.find().sort("total_points", -1).limit(10))
    result = []
    for streak in streaks:
        user = db.users.find_one({"id": streak.get("user_id")})
        if user:
            result.append(
                {
                    "username": user.get("username", ""),
                    "full_name": user.get("full_name", ""),
                    "points": int(streak.get("total_points", 0)),
                    "streak": int(streak.get("current_streak", 0)),
                }
            )
    return result
