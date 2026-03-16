from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Study Platform API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
from routers import (
    auth_router, schedule_router, resource_router, progress_router,
    test_router, analysis_router, readiness_router, notes_router,
    gamification_router, notification_router, analytics_router
)

app.include_router(auth_router.router)
app.include_router(schedule_router.router)
app.include_router(resource_router.router)
app.include_router(progress_router.router)
app.include_router(test_router.router)
app.include_router(analysis_router.router)
app.include_router(readiness_router.router)
app.include_router(notes_router.router)
app.include_router(gamification_router.router)
app.include_router(notification_router.router)
app.include_router(analytics_router.router)


@app.get("/")
def root():
    return {"message": "Study Platform API is running", "docs": "/docs"}
