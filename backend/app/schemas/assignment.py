from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.assignment_submission import SubmissionStatus


# ============================================================
# Assignment schemas
# ============================================================

class AssignmentCreate(BaseModel):
    course_day_id: int = Field(..., description="ID of the CourseDay this assignment belongs to")
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, description="Detailed instructions for the trainee")
    due_date: Optional[datetime] = Field(None, example="2026-06-30T00:00:00Z", description="Deadline for submission (UTC)")
    is_active: bool = Field(True, description="Whether the assignment is visible to trainees")

class AssignmentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    is_active: Optional[bool] = None

class AssignmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_day_id: int
    title: str
    description: Optional[str]
    file_path: Optional[str]
    due_date: Optional[datetime]
    is_active: bool
    created_by: int
    created_at: datetime


# ============================================================
# Submission schemas
# ============================================================


class SubmissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assignment_id: int
    user_id: int
    file_path: str
    submitted_at: datetime
    status: SubmissionStatus
    marks: Optional[int] = None
    review_comments: Optional[str]
    reviewed_by: Optional[int]
    reviewed_at: Optional[datetime]


class ReviewRequest(BaseModel):

    marks: Optional[int] = Field(
        None,
        ge=0,
        le=100,
        description="Marks awarded by trainer",
    )

    review_comments: Optional[str] = Field(
        None,
        description="Feedback text visible to the trainee",
    )


# ============================================================
# List wrappers (pagination-friendly)
# ============================================================


class AssignmentListResponse(BaseModel):
    total: int
    items: List[AssignmentResponse]


class SubmissionListResponse(BaseModel):
    total: int
    items: List[SubmissionResponse]