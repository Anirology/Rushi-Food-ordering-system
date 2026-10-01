from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.category import Category
from app.models.food import Food
from app.schemas.category import CategoryRead
from app.schemas.food import FoodRead

router = APIRouter(tags=["menu"])


@router.get("/categories", response_model=list[CategoryRead])
def list_categories(db: Session = Depends(get_db)) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.name)).all())


@router.get("/foods", response_model=list[FoodRead])
def list_foods(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=100),
    category_id: int | None = Query(None, gt=0),
    search: str | None = Query(None, min_length=1, max_length=100),
    sort: str = Query("name", pattern="^(name|price)$"),
    order: str = Query("asc", pattern="^(asc|desc)$"),
    available_only: bool = True,
    db: Session = Depends(get_db),
) -> list[Food]:
    statement = select(Food).options(selectinload(Food.category))
    if available_only:
        statement = statement.where(Food.is_available.is_(True))
    if category_id:
        statement = statement.where(Food.category_id == category_id)
    if search:
        term = f"%{search.strip()}%"
        statement = statement.where(or_(Food.name.ilike(term), Food.description.ilike(term)))
    order_column = Food.price if sort == "price" else Food.name
    ordering = order_column.desc() if order == "desc" else order_column.asc()
    return list(db.scalars(statement.order_by(ordering, Food.id).offset((page - 1) * limit).limit(limit)).all())


@router.get("/foods/{food_id}", response_model=FoodRead)
def get_food(food_id: int, db: Session = Depends(get_db)) -> Food:
    food = db.get(Food, food_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food item not found")
    return food
