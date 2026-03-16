from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models, schemas

router = APIRouter(prefix="/api/resources", tags=["Resources"])


@router.get("/", response_model=list[schemas.ResourceOut])
def get_resources(category: str = None, subject: str = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(models.Resource).filter(models.Resource.user_id == current_user.id)
    if category:
        q = q.filter(models.Resource.category == category)
    if subject:
        q = q.filter(models.Resource.subject == subject)
    return q.order_by(models.Resource.created_at.desc()).all()


@router.get("/{resource_id}", response_model=schemas.ResourceOut)
def get_resource(resource_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    res = db.query(models.Resource).filter(models.Resource.id == resource_id, models.Resource.user_id == current_user.id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    return res


@router.post("/", response_model=schemas.ResourceOut)
def create_resource(data: schemas.ResourceCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    resource = models.Resource(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        resource_type=data.resource_type,
        category=data.category,
        subject=data.subject,
        url=data.url,
        tags=data.tags
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.delete("/{resource_id}")
def delete_resource(resource_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    res = db.query(models.Resource).filter(models.Resource.id == resource_id, models.Resource.user_id == current_user.id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")
    db.delete(res)
    db.commit()
    return {"message": "Resource deleted"}
