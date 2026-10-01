"""Create the initial Rushi ordering schema."""

from alembic import op

from app.db.base import Base
from app.models import Category, Customer, Food, Order, OrderItem

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    Base.metadata.create_all(bind=op.get_bind())


def downgrade() -> None:
    Base.metadata.drop_all(bind=op.get_bind())
