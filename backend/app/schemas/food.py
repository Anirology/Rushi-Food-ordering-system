from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class FoodCreate(BaseModel):
    category_id: int = Field(gt=0)
    name: str = Field(min_length=2, max_length=160)
    slug: str = Field(min_length=2, max_length=180, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    description: str | None = None
    price: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    is_available: bool = True


class FoodUpdate(BaseModel):
    category_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=2, max_length=160)
    description: str | None = None
    price: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    image_url: str | None = Field(default=None, max_length=500)
    is_available: bool | None = None


class FoodRead(BaseModel):
    id: int
    category_id: int
    name: str
    slug: str
    description: str | None
    price: Decimal
    image_url: str | None
    is_available: bool
    model_config = ConfigDict(from_attributes=True)
