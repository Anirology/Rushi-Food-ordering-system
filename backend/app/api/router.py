from fastapi import APIRouter

from app.api.routes import admin, health, menu, orders

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(menu.router)
api_router.include_router(orders.router)
api_router.include_router(admin.router)
