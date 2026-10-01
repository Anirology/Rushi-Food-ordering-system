from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.category import Category
from app.models.customer import Customer
from app.models.food import Food
from app.models.order import ORDER_STATUSES, Order, OrderItem
from app.schemas.category import CategoryCreate, CategoryRead
from app.schemas.food import FoodCreate, FoodRead, FoodUpdate
from app.schemas.order import OrderRead, OrderStatusUpdate
router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/categories", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)) -> Category:
    category = Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.patch("/categories/{category_id}", response_model=CategoryRead)
def update_category(category_id: int, payload: CategoryCreate, db: Session = Depends(get_db)) -> Category:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    for key, value in payload.model_dump().items():
        setattr(category, key, value)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)) -> None:
    category = db.get(Category, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    if db.scalar(select(func.count()).select_from(Food).where(Food.category_id == category_id)):
        raise HTTPException(status_code=409, detail="Move or remove this category's foods first")
    db.delete(category)
    db.commit()


@router.post("/foods", response_model=FoodRead, status_code=status.HTTP_201_CREATED)
def create_food(payload: FoodCreate, db: Session = Depends(get_db)) -> Food:
    if db.get(Category, payload.category_id) is None:
        raise HTTPException(status_code=422, detail="Category does not exist")
    values = payload.model_dump()
    if values.get("image_url"):
        values["image_url"] = str(values["image_url"])
    food = Food(**values)
    db.add(food)
    db.commit()
    db.refresh(food)
    return food


@router.patch("/foods/{food_id}", response_model=FoodRead)
def update_food(food_id: int, payload: FoodUpdate, db: Session = Depends(get_db)) -> Food:
    food = db.get(Food, food_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food item not found")
    values = payload.model_dump(exclude_unset=True)
    if values.get("category_id") and db.get(Category, values["category_id"]) is None:
        raise HTTPException(status_code=422, detail="Category does not exist")
    if values.get("image_url"):
        values["image_url"] = str(values["image_url"])
    for key, value in values.items():
        setattr(food, key, value)
    db.commit()
    db.refresh(food)
    return food


@router.delete("/foods/{food_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_food(food_id: int, db: Session = Depends(get_db)) -> None:
    food = db.get(Food, food_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food item not found")
    if db.scalar(select(func.count()).select_from(OrderItem).where(OrderItem.food_id == food_id)):
        raise HTTPException(status_code=409, detail="This food appears in an order; mark it unavailable instead")
    db.delete(food)
    db.commit()


@router.get("/orders", response_model=list[OrderRead])
def admin_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[Order]:
    statement = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())
    return list(db.scalars(statement.offset((page - 1) * limit).limit(limit)).all())


@router.patch("/orders/{order_id}/status", response_model=OrderRead)
def set_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)) -> Order:
    order = db.scalar(select(Order).where(Order.id == order_id).options(selectinload(Order.items)))
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    if payload.status not in ORDER_STATUSES:
        raise HTTPException(status_code=422, detail="Invalid order status")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order


@router.get("/customers")
def admin_customers(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[dict[str, object]]:
    customers = db.scalars(select(Customer).order_by(Customer.created_at.desc()).offset((page - 1) * limit).limit(limit)).all()
    return [
        {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
            "address": customer.address,
            "order_count": len(customer.orders),
        }
        for customer in customers
    ]


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)) -> dict[str, int | float]:
    total_foods = db.scalar(select(func.count()).select_from(Food)) or 0
    total_categories = db.scalar(select(func.count()).select_from(Category)) or 0
    total_customers = db.scalar(select(func.count()).select_from(Customer)) or 0
    total_orders = db.scalar(select(func.count()).select_from(Order)) or 0
    revenue = db.scalar(select(func.coalesce(func.sum(Order.total_amount), 0)).where(Order.status != "cancelled")) or 0
    pending = db.scalar(select(func.count()).select_from(Order).where(Order.status == "pending")) or 0
    delivered = db.scalar(select(func.count()).select_from(Order).where(Order.status == "delivered")) or 0
    return {
        "total_foods": total_foods,
        "total_categories": total_categories,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": float(revenue),
        "pending_orders": pending,
        "delivered_orders": delivered,
    }


@router.get("/popular-foods")
def popular_foods(limit: int = Query(5, ge=1, le=20), db: Session = Depends(get_db)) -> list[dict[str, object]]:
    statement = (
        select(Food.id, Food.name, func.sum(OrderItem.quantity).label("ordered_quantity"))
        .join(OrderItem, OrderItem.food_id == Food.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(Order.status != "cancelled")
        .group_by(Food.id, Food.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(limit)
    )
    return [
        {"food_id": row.id, "name": row.name, "ordered_quantity": int(row.ordered_quantity)}
        for row in db.execute(statement)
    ]
