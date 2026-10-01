from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import place_order

router = APIRouter(tags=["orders"])


@router.post("/orders", response_model=OrderRead, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)) -> Order:
    return place_order(db, payload)


@router.get("/orders", response_model=list[OrderRead])
def list_orders(
    email: str = Query(min_length=5, max_length=254),
    db: Session = Depends(get_db),
) -> list[Order]:
    customer = db.scalar(select(Customer).where(Customer.email == email.lower()))
    if customer is None:
        return []
    statement = (
        select(Order)
        .where(Order.customer_id == customer.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    return list(db.scalars(statement).all())


@router.get("/orders/{order_number}", response_model=OrderRead)
def get_order(order_number: str, db: Session = Depends(get_db)) -> Order:
    statement = (
        select(Order)
        .where(Order.order_number == order_number)
        .options(selectinload(Order.items))
    )
    order = db.scalar(statement)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
