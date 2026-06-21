from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from app.database.base import Base  # adjust import to match your project's Base

if TYPE_CHECKING:
    from app.models.assignment_submission import AssignmentSubmission


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Integer reference 
    course_day_id: Mapped[int] = mapped_column(
    Integer,
    ForeignKey("course_days.id"),
    nullable=False,
    index=True,
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Path where the admin-uploaded brief/template file is stored.
    file_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Integer reference to admin user
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationship to submissions (back-populated from AssignmentSubmission)
    submissions: Mapped[List["AssignmentSubmission"]] = relationship(
        "AssignmentSubmission",
        back_populates="assignment",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Assignment id={self.id} title={self.title!r} course_day_id={self.course_day_id}>"