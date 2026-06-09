from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    duration_days = Column(
        Integer,
        nullable=False
    )

    thumbnail_url = Column(
        String(500),
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    days = relationship(
        "CourseDay",
        back_populates="course",
        cascade="all, delete-orphan"
    )