from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from datetime import datetime, timedelta
import models, schemas

router = APIRouter(prefix="/api/gamification", tags=["Gamification"])


@router.get("/streak", response_model=schemas.StreakOut)
def get_streak(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    streak = db.query(models.Streak).filter(models.Streak.user_id == current_user.id).first()
    if not streak:
        streak = models.Streak(user_id=current_user.id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    return streak


@router.post("/log-activity")
def log_activity(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    streak = db.query(models.Streak).filter(models.Streak.user_id == current_user.id).first()
    if not streak:
        streak = models.Streak(user_id=current_user.id)
        db.add(streak)
        db.commit()
        db.refresh(streak)
    
    today = datetime.utcnow().date()
    last = streak.last_activity_date.date() if streak.last_activity_date else None
    
    if last == today:
        return {"message": "Already logged today", "current_streak": streak.current_streak}
    
    if last == today - timedelta(days=1):
        streak.current_streak += 1
    else:
        streak.current_streak = 1
    
    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
    streak.total_points += 10
    streak.last_activity_date = datetime.utcnow()
    db.commit()
    
    # Check for badge awards
    _check_badges(current_user.id, streak, db)
    
    return {"current_streak": streak.current_streak, "points": streak.total_points}


def _check_badges(user_id: int, streak: models.Streak, db: Session):
    badges_to_check = [
        (7, "7-Day Warrior", "🔥", "Maintained a 7-day study streak"),
        (30, "Monthly Master", "🏆", "Maintained a 30-day study streak"),
    ]
    for days, name, icon, desc in badges_to_check:
        if streak.current_streak >= days:
            badge = db.query(models.Badge).filter(models.Badge.name == name).first()
            if not badge:
                badge = models.Badge(name=name, description=desc, icon=icon)
                db.add(badge)
                db.commit()
                db.refresh(badge)
            
            existing = db.query(models.UserBadge).filter(
                models.UserBadge.user_id == user_id, models.UserBadge.badge_id == badge.id
            ).first()
            if not existing:
                db.add(models.UserBadge(user_id=user_id, badge_id=badge.id))
                db.commit()


@router.get("/badges")
def get_badges(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    user_badges = db.query(models.UserBadge).filter(models.UserBadge.user_id == current_user.id).all()
    all_badges = db.query(models.Badge).all()
    
    earned_ids = {ub.badge_id for ub in user_badges}
    earned_map = {ub.badge_id: ub.earned_at for ub in user_badges}
    
    return [
        {
            "id": b.id, "name": b.name, "description": b.description, "icon": b.icon,
            "earned": b.id in earned_ids,
            "earned_at": earned_map.get(b.id, None)
        }
        for b in all_badges
    ]


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    streaks = db.query(models.Streak).order_by(models.Streak.total_points.desc()).limit(10).all()
    result = []
    for s in streaks:
        user = db.query(models.User).filter(models.User.id == s.user_id).first()
        if user:
            result.append({
                "username": user.username,
                "full_name": user.full_name,
                "points": s.total_points,
                "streak": s.current_streak
            })
    return result
