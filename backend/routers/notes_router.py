from fastapi import APIRouter, Depends, HTTPException
from typing import Any

import schemas
from auth import get_current_user
from database import get_db, get_next_id, now_utc

router = APIRouter(prefix="/api/notes", tags=["Notes"])


def _clean(doc: dict | None):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


@router.get("/", response_model=list[schemas.NoteOut])
def get_notes(subject: str = None, bookmarked: bool = None, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    query = {"user_id": current_user["id"]}
    if subject:
        query["subject"] = subject
    if bookmarked is not None:
        query["is_bookmarked"] = bookmarked

    notes = list(db.notes.find(query).sort("updated_at", -1))
    return [_clean(note) for note in notes]


@router.get("/{note_id}", response_model=schemas.NoteOut)
def get_note(note_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    note = db.notes.find_one({"id": note_id, "user_id": current_user["id"]})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return _clean(note)


@router.post("/", response_model=schemas.NoteOut)
def create_note(data: schemas.NoteCreate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    now = now_utc()
    note = {
        "id": get_next_id(db, "notes"),
        "user_id": current_user["id"],
        "title": data.title,
        "content": data.content or "",
        "subject": data.subject or "",
        "tags": data.tags or [],
        "is_bookmarked": False,
        "is_revision": bool(data.is_revision),
        "created_at": now,
        "updated_at": now,
    }
    db.notes.insert_one(note)
    return note


@router.put("/{note_id}", response_model=schemas.NoteOut)
def update_note(note_id: int, data: schemas.NoteUpdate, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    note = db.notes.find_one({"id": note_id, "user_id": current_user["id"]})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    updates["updated_at"] = now_utc()
    db.notes.update_one({"id": note_id}, {"$set": updates})

    updated = db.notes.find_one({"id": note_id, "user_id": current_user["id"]})
    return _clean(updated)


@router.delete("/{note_id}")
def delete_note(note_id: int, current_user: dict = Depends(get_current_user), db: Any = Depends(get_db)):
    deleted = db.notes.delete_one({"id": note_id, "user_id": current_user["id"]})
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
    return {"message": "Note deleted"}
