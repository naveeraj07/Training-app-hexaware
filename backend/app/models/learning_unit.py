from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class LearningUnit(Base):
    __tablename__ = "learning_units"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    day_id = Column(
        Integer,
        ForeignKey("course_days.id"),
        nullable=False
    )

    title = Column(
        String(255),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    display_order = Column(
        Integer,
        nullable=False
    )

    day = relationship(
        "CourseDay",
        back_populates="learning_units"
    )

    contents = relationship(
        "Content",
        back_populates="learning_unit",
        cascade="all, delete-orphan"
    )

    videos = relationship(
        "Video",
        back_populates="learning_unit",
        cascade="all, delete-orphan"
    )