from decimal import Decimal
from uuid import uuid4
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.customer import Customer
from app.models.food import Food
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate


def place_order(db: Session, payload: OrderCreate) -> Order:
    customer_data = payload.customer.model_dump()
    customer_data["email"] = customer_data["email"].lower()
    customer = db.scalar(select(Customer).where(Customer.email == customer_data["email"]))
    if customer is None:
        customer = Customer(**customer_data)
        db.add(customer)
        db.flush()
    else:
        for key in ("name", "phone", "address"):
            setattr(customer, key, customer_data[key])

    lines: list[OrderItem] = []
    total = Decimal("0.00")
    for requested in payload.items:
        food = db.scalar(select(Food).where(Food.id == requested.food_id).with_for_update())
        if food is None or not food.is_available:
            db.rollback()
            raise HTTPException(status_code=409, detail=f"Food item {requested.food_id} is unavailable")
        unit_price = Decimal(food.price)
        subtotal = unit_price * requested.quantity
        total += subtotal
        lines.append(
            OrderItem(
                food_id=food.id,
                food_name=food.name,
                quantity=requested.quantity,
                unit_price=unit_price,
                subtotal=subtotal,
            )
        )

    order = Order(
        order_number=f"RSH-{uuid4().hex[:10].upper()}",
        customer=customer,
        total_amount=total,
        status="pending",
        items=lines,
    )
    db.add(order)
    db.commit()
    return db.scalar(
        select(Order).where(Order.id == order.id).options(selectinload(Order.items))
    )
