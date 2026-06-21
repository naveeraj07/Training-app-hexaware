import enum
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base  # adjust import to match your project's Base

if TYPE_CHECKING:
    from app.models.assignment import Assignment


class SubmissionStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    PASSED = "PASSED"
    FAILED = "FAILED"


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # FK to assignments table (within this module — safe to reference directly).
    assignment_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("assignments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Integer reference to trainee 
    user_id: Mapped[int] = mapped_column(
    Integer, ForeignKey("users.id"), nullable=False,
    index=True,)

    # Path where the trainee-uploaded file is stored.
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default=SubmissionStatus.SUBMITTED.value,
        nullable=False,
    )

    marks: Mapped[int | None] = mapped_column(
    Integer,
    nullable=True
    )
    
    # Admin's review comments after evaluating the submission.
    review_comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Integer reference to reviewing admin
    reviewed_by: Mapped[Optional[int]] = mapped_column(Integer,ForeignKey("users.id"), nullable=True)

    reviewed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ------------------------------------------------------------------ #
    # Relationships
    # ------------------------------------------------------------------ #
    assignment: Mapped["Assignment"] = relationship(
        "Assignment", back_populates="submissions"
    )

    def __repr__(self) -> str:
        return (
            f"<AssignmentSubmission id={self.id} "
            f"assignment_id={self.assignment_id} "
            f"user_id={self.user_id} "
            f"status={self.status}>"
        )