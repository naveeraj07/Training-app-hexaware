from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    learning_unit_id = Column(
        Integer,
        ForeignKey("learning_units.id"),
        nullable=False
    )

    title = Column(
        String(255),
        nullable=False
    )

    video_url = Column(
        String(500),
        nullable=False
    )

    duration_minutes = Column(
        Integer,
        nullable=True
    )

    learning_unit = relationship(
        "LearningUnit",
        back_populates="videos"
    )