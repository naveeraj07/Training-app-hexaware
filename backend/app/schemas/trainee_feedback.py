from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TraineeFeedbackCreate(BaseModel):
    batch_id: int | None = None
    category: str = Field(default="GENERAL", description="TECHNICAL, PROBLEM_SOLVING, COMMUNICATION, GENERAL")
    rating: int = Field(ge=1, le=5, default=5, description="Star rating between 1 and 5")
    feedback_text: str = Field(min_length=1, description="Actionable remarks and guidance")
    strengths: str | None = None
    areas_of_improvement: str | None = None


class TraineeFeedbackResponse(BaseModel):
    id: int
    trainer_id: int
    trainer_name: str | None = None
    trainee_id: int
    trainee_name: str | None = None
    batch_id: int | None = None
    batch_name: str | None = None
    category: str
    rating: int
    feedback_text: str
    strengths: str | None = None
    areas_of_improvement: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
