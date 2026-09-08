from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CandidateScoreBreakdown(BaseModel):
    assessment_avg: float
    assignment_avg: float
    progress_pct: float
    attendance_pct: float
    total_assessments_taken: int = 0
    total_assignments_graded: int = 0


class CandidateRankItem(BaseModel):
    rank: int
    trainee_id: int
    employee_id: str
    name: str
    email: str
    composite_score: float
    tier: str  # Top Performer, On Track, Needs Attention
    percentile: float
    breakdown: CandidateScoreBreakdown
    last_feedback: str | None = None
    last_feedback_rating: int | None = None


class BatchRankingResponse(BaseModel):
    batch_id: int
    batch_name: str
    course_name: str
    total_trainees: int
    batch_average_score: float
    top_performer: str | None = None
    rankings: list[CandidateRankItem]

    model_config = ConfigDict(from_attributes=True)
