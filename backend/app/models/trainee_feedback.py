from datetime import datetime
from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class TraineeFeedback(Base):
    __tablename__ = "trainee_feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    trainer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    trainee_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    batch_id: Mapped[int | None] = mapped_column(
        ForeignKey("batches.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(50),
        default="GENERAL",
        nullable=False,
    )  # e.g., TECHNICAL, PROBLEM_SOLVING, COMMUNICATION, GENERAL

    rating: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
    )  # 1 to 5 stars

    feedback_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    strengths: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    areas_of_improvement: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    trainer = relationship("User", foreign_keys=[trainer_id])
    trainee = relationship("User", foreign_keys=[trainee_id])
    batch = relationship("Batch", foreign_keys=[batch_id])
