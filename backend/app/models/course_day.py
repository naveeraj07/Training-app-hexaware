from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class CourseDay(Base):
    __tablename__ = "course_days"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    day_number = Column(
        Integer,
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

    course = relationship(
        "Course",
        back_populates="days"
    )

    learning_units = relationship(
        "LearningUnit",
        back_populates="day",
        cascade="all, delete-orphan"
    )