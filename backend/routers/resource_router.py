from fastapi import APIRouter, Depends, HTTPException
from typing import Any

import schemas
from auth import get_current_user
from database import get_db, get_next_id, now_utc

router = APIRouter(prefix="/api/resources", tags=["Resources"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


@router.get("/", response_model=list[schemas.ResourceOut])
def get_resources(category: str = None, subject: str = None, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    query = {"user_id": current_user["id"]}
    if category:
        query["category"] = category
    if subject:
        query["subject"] = subject

    resources = list(db.resources.find(query).sort("created_at", -1))
    return [_clean(resource) for resource in resources]


@router.get("/{resource_id}", response_model=schemas.ResourceOut)
def get_resource(resource_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    resource = db.resources.find_one({"id": resource_id, "user_id": current_user["id"]})
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return _clean(resource)


@router.post("/", response_model=schemas.ResourceOut)
def create_resource(data: schemas.ResourceCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    resource = {
        "id": get_next_id(db, "resources"),
        "user_id": current_user["id"],
        "title": data.title,
        "description": data.description or "",
        "resource_type": data.resource_type,
        "category": data.category or "general",
        "subject": data.subject or "",
        "url": data.url or "",
        "file_path": "",
        "tags": data.tags or [],
        "created_at": now_utc(),
    }
    db.resources.insert_one(resource)
    return resource


@router.delete("/{resource_id}")
def delete_resource(resource_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    deleted = db.resources.delete_one({"id": resource_id, "user_id": current_user["id"]})
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted"}
