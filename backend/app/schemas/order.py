from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

OrderStatus = Literal["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]


class CustomerInput(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=40)
    address: str = Field(min_length=5, max_length=500)


class OrderItemInput(BaseModel):
    food_id: int = Field(gt=0)
    quantity: int = Field(ge=1, le=50)


class OrderCreate(BaseModel):
    customer: CustomerInput
    items: list[OrderItemInput] = Field(min_length=1)


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderItemRead(BaseModel):
    id: int
    food_id: int
    food_name: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    model_config = ConfigDict(from_attributes=True)


class OrderRead(BaseModel):
    id: int
    order_number: str
    customer_id: int
    total_amount: Decimal
    status: OrderStatus
    created_at: datetime
    items: list[OrderItemRead]
    model_config = ConfigDict(from_attributes=True)
