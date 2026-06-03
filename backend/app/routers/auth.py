from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import (
    create_user,
    generate_activation_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post(
    "/users",
    response_model=UserResponse
)
async def create_user_endpoint(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):

    try:
        user = await create_user(
            db,
            user_data
        )

        await generate_activation_token(
            db,
            user.id
        )

        return user

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )