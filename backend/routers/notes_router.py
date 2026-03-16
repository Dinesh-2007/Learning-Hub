from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
from datetime import datetime
import models, schemas

router = APIRouter(prefix="/api/notes", tags=["Notes"])


@router.get("/", response_model=list[schemas.NoteOut])
def get_notes(subject: str = None, bookmarked: bool = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(models.Note).filter(models.Note.user_id == current_user.id)
    if subject:
        q = q.filter(models.Note.subject == subject)
    if bookmarked is not None:
        q = q.filter(models.Note.is_bookmarked == bookmarked)
    return q.order_by(models.Note.updated_at.desc()).all()


@router.get("/{note_id}", response_model=schemas.NoteOut)
def get_note(note_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.post("/", response_model=schemas.NoteOut)
def create_note(data: schemas.NoteCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = models.Note(
        user_id=current_user.id,
        title=data.title,
        content=data.content,
        subject=data.subject,
        tags=data.tags,
        is_revision=data.is_revision
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.put("/{note_id}", response_model=schemas.NoteOut)
def update_note(note_id: int, data: schemas.NoteUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    for field, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(note, field, value)
    note.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}")
def delete_note(note_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == current_user.id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}
