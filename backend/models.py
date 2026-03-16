from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    full_name = Column(String(100), default="")
    avatar_url = Column(String(300), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    schedules = relationship("StudySchedule", back_populates="user")
    resources = relationship("Resource", back_populates="user")
    subject_progress = relationship("SubjectProgress", back_populates="user")
    test_submissions = relationship("TestSubmission", back_populates="user")
    readiness_checkins = relationship("ReadinessCheckin", back_populates="user")
    notes = relationship("Note", back_populates="user")
    streaks = relationship("Streak", back_populates="user")
    badges = relationship("UserBadge", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    study_logs = relationship("StudyLog", back_populates="user")


class StudySchedule(Base):
    __tablename__ = "study_schedules"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    exam_date = Column(DateTime, nullable=True)
    interview_date = Column(DateTime, nullable=True)
    hours_per_day = Column(Float, default=4.0)
    priority_subjects = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="schedules")
    tasks = relationship("ScheduleTask", back_populates="schedule", cascade="all, delete-orphan")


class ScheduleTask(Base):
    __tablename__ = "schedule_tasks"
    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("study_schedules.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    subject = Column(String(100), default="")
    date = Column(DateTime, nullable=False)
    duration_hours = Column(Float, default=1.0)
    is_completed = Column(Boolean, default=False)
    priority = Column(String(20), default="medium")  # low, medium, high
    
    schedule = relationship("StudySchedule", back_populates="tasks")


class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    resource_type = Column(String(50), nullable=False)  # pdf, link, note, video
    category = Column(String(50), default="general")  # notes, coding, aptitude, interview
    subject = Column(String(100), default="")
    url = Column(String(500), default="")
    file_path = Column(String(500), default="")
    tags = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resources")


class SubjectProgress(Base):
    __tablename__ = "subject_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    total_topics = Column(Integer, default=0)
    completed_topics = Column(Integer, default=0)
    target_date = Column(DateTime, nullable=True)
    
    user = relationship("User", back_populates="subject_progress")
    topics = relationship("TopicProgress", back_populates="subject_progress", cascade="all, delete-orphan")


class TopicProgress(Base):
    __tablename__ = "topic_progress"
    id = Column(Integer, primary_key=True, index=True)
    subject_progress_id = Column(Integer, ForeignKey("subject_progress.id"), nullable=False)
    topic_name = Column(String(200), nullable=False)
    status = Column(String(30), default="not_started")  # not_started, learning, practicing, mastered
    notes = Column(Text, default="")
    
    subject_progress = relationship("SubjectProgress", back_populates="topics")


class MockTest(Base):
    __tablename__ = "mock_tests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, default="")
    test_type = Column(String(50), nullable=False)  # aptitude, coding, subject
    subject = Column(String(100), default="")
    difficulty = Column(String(20), default="medium")
    duration_minutes = Column(Integer, default=30)
    total_marks = Column(Integer, default=100)
    questions = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    
    submissions = relationship("TestSubmission", back_populates="test")


class TestSubmission(Base):
    __tablename__ = "test_submissions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    test_id = Column(Integer, ForeignKey("mock_tests.id"), nullable=False)
    answers = Column(JSON, default={})
    score = Column(Float, default=0)
    total_marks = Column(Float, default=0)
    accuracy = Column(Float, default=0)
    time_taken_minutes = Column(Float, default=0)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="test_submissions")
    test = relationship("MockTest", back_populates="submissions")


class ReadinessCheckin(Base):
    __tablename__ = "readiness_checkins"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    subject = Column(String(100), nullable=False)
    confidence_level = Column(Integer, default=1)  # 1-5
    notes = Column(Text, default="")
    checked_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="readiness_checkins")


class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, default="")
    subject = Column(String(100), default="")
    tags = Column(JSON, default=[])
    is_bookmarked = Column(Boolean, default=False)
    is_revision = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="notes")


class Streak(Base):
    __tablename__ = "streaks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(DateTime, nullable=True)
    total_points = Column(Integer, default=0)
    
    user = relationship("User", back_populates="streaks")


class Badge(Base):
    __tablename__ = "badges"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(300), default="")
    icon = Column(String(50), default="🏆")
    condition = Column(String(200), default="")


class UserBadge(Base):
    __tablename__ = "user_badges"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="badges")
    badge = relationship("Badge")


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, default="")
    notification_type = Column(String(50), default="info")  # info, reminder, alert, achievement
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="notifications")


class StudyLog(Base):
    __tablename__ = "study_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    hours_studied = Column(Float, default=0)
    subjects_covered = Column(JSON, default=[])
    tasks_completed = Column(Integer, default=0)
    
    user = relationship("User", back_populates="study_logs")
