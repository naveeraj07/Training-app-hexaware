from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Progress(Base):
    __tablename__ = "progress"

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

    is_completed = Column(
        Boolean,
        default=False
    )

    learning_unit = relationship(
        "LearningUnit"
    )