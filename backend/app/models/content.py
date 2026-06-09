from sqlalchemy import (
    Column,
    Integer,
    Text,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.base import Base


class Content(Base):
    __tablename__ = "contents"

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

    content_text = Column(
        Text,
        nullable=False
    )

    learning_unit = relationship(
        "LearningUnit",
        back_populates="contents"
    )