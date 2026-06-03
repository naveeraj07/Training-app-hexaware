from datetime import datetime, timedelta
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.activation_token import ActivationToken
from app.schemas.user import UserCreate


async def create_user(
    db: AsyncSession,
    user_data: UserCreate
) -> User:

    existing_user = await db.scalar(
        select(User).where(
            User.email == user_data.email
        )
    )

    if existing_user:
        raise ValueError(
            "User with this email already exists"
        )

    user = User(
        employee_id=user_data.employee_id,
        email=user_data.email,
        is_active=False
    )

    db.add(user)

    await db.commit()
    await db.refresh(user)

    return user


async def generate_activation_token(
    db: AsyncSession,
    user_id: int
) -> ActivationToken:

    activation_token = ActivationToken(
        user_id=user_id,
        token=str(uuid4()),
        expires_at=datetime.utcnow() + timedelta(days=1),
        is_used=False
    )

    db.add(activation_token)

    await db.commit()
    await db.refresh(activation_token)

    return activation_token