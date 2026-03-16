from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# ---- Auth Schemas ----
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = ""

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    avatar_url: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str


# ---- Schedule Schemas ----
class ScheduleTaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    subject: Optional[str] = ""
    date: datetime
    duration_hours: Optional[float] = 1.0
    priority: Optional[str] = "medium"

class ScheduleTaskOut(BaseModel):
    id: int
    title: str
    description: str
    subject: str
    date: datetime
    duration_hours: float
    is_completed: bool
    priority: str
    class Config:
        from_attributes = True


class ScheduleTaskManualCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    subject: Optional[str] = ""
    date: datetime
    duration_hours: Optional[float] = 1.0
    priority: Optional[str] = "medium"


class ScheduleTaskReschedule(BaseModel):
    date: datetime


class ScheduleTaskUpdate(BaseModel):
    priority: Optional[str] = None
    is_completed: Optional[bool] = None

class ScheduleCreate(BaseModel):
    title: str
    exam_date: Optional[datetime] = None
    interview_date: Optional[datetime] = None
    hours_per_day: Optional[float] = 4.0
    priority_subjects: Optional[List[str]] = []
    topics: Optional[List[str]] = []

class ScheduleOut(BaseModel):
    id: int
    title: str
    exam_date: Optional[datetime]
    interview_date: Optional[datetime]
    hours_per_day: float
    priority_subjects: list
    created_at: datetime
    tasks: List[ScheduleTaskOut] = []
    class Config:
        from_attributes = True


# ---- Resource Schemas ----
class ResourceCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    resource_type: str
    category: Optional[str] = "general"
    subject: Optional[str] = ""
    url: Optional[str] = ""
    tags: Optional[List[str]] = []

class ResourceOut(BaseModel):
    id: int
    title: str
    description: str
    resource_type: str
    category: str
    subject: str
    url: str
    file_path: str
    tags: list
    created_at: datetime
    class Config:
        from_attributes = True


# ---- Progress Schemas ----
class TopicProgressCreate(BaseModel):
    topic_name: str
    status: Optional[str] = "not_started"

class TopicProgressOut(BaseModel):
    id: int
    topic_name: str
    status: str
    notes: str
    class Config:
        from_attributes = True

class SubjectProgressCreate(BaseModel):
    subject: str
    total_topics: Optional[int] = 0
    target_date: Optional[datetime] = None
    topics: Optional[List[TopicProgressCreate]] = []

class SubjectProgressOut(BaseModel):
    id: int
    subject: str
    total_topics: int
    completed_topics: int
    target_date: Optional[datetime]
    topics: List[TopicProgressOut] = []
    class Config:
        from_attributes = True


# ---- Test Schemas ----
class TestSubmissionCreate(BaseModel):
    test_id: int
    answers: dict = {}
    time_taken_minutes: Optional[float] = 0

class TestSubmissionOut(BaseModel):
    id: int
    test_id: int
    answers: dict
    score: float
    total_marks: float
    accuracy: float
    time_taken_minutes: float
    submitted_at: datetime
    class Config:
        from_attributes = True

class MockTestOut(BaseModel):
    id: int
    title: str
    description: str
    test_type: str
    subject: str
    difficulty: str
    duration_minutes: int
    total_marks: int
    questions: list
    class Config:
        from_attributes = True


# ---- Readiness Schemas ----
class ReadinessCreate(BaseModel):
    subject: str
    confidence_level: int
    notes: Optional[str] = ""

class ReadinessOut(BaseModel):
    id: int
    subject: str
    confidence_level: int
    notes: str
    checked_at: datetime
    class Config:
        from_attributes = True


# ---- Notes Schemas ----
class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = ""
    subject: Optional[str] = ""
    tags: Optional[List[str]] = []
    is_revision: Optional[bool] = False

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    subject: Optional[str] = None
    tags: Optional[List[str]] = None
    is_bookmarked: Optional[bool] = None
    is_revision: Optional[bool] = None

class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    subject: str
    tags: list
    is_bookmarked: bool
    is_revision: bool
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


# ---- Notification Schemas ----
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True


# ---- Gamification Schemas ----
class StreakOut(BaseModel):
    current_streak: int
    longest_streak: int
    total_points: int
    last_activity_date: Optional[datetime]
    class Config:
        from_attributes = True

class BadgeOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    earned_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# ---- Analytics Schemas ----
class StudyLogCreate(BaseModel):
    hours_studied: float
    subjects_covered: Optional[List[str]] = []
    tasks_completed: Optional[int] = 0

class StudyLogOut(BaseModel):
    id: int
    date: datetime
    hours_studied: float
    subjects_covered: list
    tasks_completed: int
    class Config:
        from_attributes = True


# ---- Schedule Generator ----
class AutoScheduleRequest(BaseModel):
    title: str
    exam_date: datetime
    subjects: List[str]
    hours_per_day: Optional[float] = 4.0
    priority_subjects: Optional[List[str]] = []
