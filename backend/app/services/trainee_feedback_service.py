from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trainee_feedback import TraineeFeedback
from app.models.user import User
from app.models.batch_models import Batch, BatchTrainee
from app.schemas.trainee_feedback import TraineeFeedbackCreate


async def create_trainee_feedback(
    db: AsyncSession,
    trainer_id: int,
    trainee_id: int,
    data: TraineeFeedbackCreate,
) -> TraineeFeedback:
    # 1. Verify trainee exists
    trainee = await db.get(User, trainee_id)
    if not trainee:
        raise HTTPException(status_code=404, detail="Trainee not found.")

    # 2. Check trainer
    trainer = await db.get(User, trainer_id)
    if not trainer:
        raise HTTPException(status_code=403, detail="Trainer not identified.")

    # 3. If batch_id provided, verify
    if data.batch_id:
        batch = await db.get(Batch, data.batch_id)
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found.")

    feedback_record = TraineeFeedback(
        trainer_id=trainer_id,
        trainee_id=trainee_id,
        batch_id=data.batch_id,
        category=data.category.upper(),
        rating=data.rating,
        feedback_text=data.feedback_text,
        strengths=data.strengths,
        areas_of_improvement=data.areas_of_improvement,
        created_at=datetime.utcnow(),
    )

    db.add(feedback_record)
    await db.commit()
    await db.refresh(feedback_record)

    return feedback_record


async def get_trainee_feedback_history(
    db: AsyncSession,
    trainee_id: int,
    batch_id: int | None = None,
) -> list[dict]:
    stmt = (
        select(
            TraineeFeedback,
            User.name.label("trainer_name"),
            Batch.name.label("batch_name"),
        )
        .join(User, User.id == TraineeFeedback.trainer_id)
        .outerjoin(Batch, Batch.id == TraineeFeedback.batch_id)
        .where(TraineeFeedback.trainee_id == trainee_id)
    )

    if batch_id:
        stmt = stmt.where(TraineeFeedback.batch_id == batch_id)

    stmt = stmt.order_by(TraineeFeedback.created_at.desc())
    result = await db.execute(stmt)
    rows = result.all()

    items = []
    for fb, trainer_name, batch_name in rows:
        items.append({
            "id": fb.id,
            "trainer_id": fb.trainer_id,
            "trainer_name": trainer_name or "Assigned Trainer",
            "trainee_id": fb.trainee_id,
            "batch_id": fb.batch_id,
            "batch_name": batch_name,
            "category": fb.category,
            "rating": fb.rating,
            "feedback_text": fb.feedback_text,
            "strengths": fb.strengths,
            "areas_of_improvement": fb.areas_of_improvement,
            "created_at": fb.created_at,
        })
    return items
