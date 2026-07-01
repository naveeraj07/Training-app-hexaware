"""merge authentication and develop heads

Revision ID: 43c301e47b57
Revises: 9680e3bce09d, 9f0e2984c40c
Create Date: 2026-06-21 17:49:22.081009

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '43c301e47b57'
down_revision: Union[str, Sequence[str], None] = ('9680e3bce09d', '9f0e2984c40c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
