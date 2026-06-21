from pathlib import Path
from pydantic import BaseModel, ConfigDict, Field

from fastapi import APIRouter, Depends, File, Query, UploadFile, status, Form
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db  # adjust to match your project
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentListResponse,
    AssignmentResponse,
    ReviewRequest,
    SubmissionListResponse,
    SubmissionResponse,
)
from app.services import assignment_service

router = APIRouter(
    prefix="/assignments",
    tags=["Assignments"]
)

# ------------------------------------------------------------------ #
# Auth stubs — replace with your real dependencies
# ------------------------------------------------------------------ #

async def get_current_admin_user() -> int:
    """
    Stub: return the current admin's user_id.
    Replace with your JWT / session dependency.
    e.g. return current_user.id
    """
    return 1  # TODO: replace with real admin auth


async def get_current_trainee_user() -> int:
    """
    Stub: return the current trainee's user_id.
    Replace with your JWT / session dependency.
    """
    return 2  # TODO: replace with real trainee auth


# ================================================================== #
# Admin — Assignment management
# ================================================================== #

from datetime import datetime
from fastapi import Form
from typing import Optional

@router.post(
    "",
    response_model=AssignmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Admin] Create a new assignment",
)
async def create_assignment(
    course_day_id: int = Form(...),
    title: str = Form(...),
    description: str | None = Form(None),
    due_date: Optional[datetime] = Form(None,description="Example: 2026-01-01T00:00:00Z"),
    file: UploadFile = File(..., description="PDF, DOC, or DOCX — max 20 MB"),
    db: AsyncSession = Depends(get_db),
    admin_id: int = Depends(get_current_admin_user),
):
    return await assignment_service.create_assignment(
        db=db,
        course_day_id=course_day_id,
        title=title,
        description=description,
        due_date=due_date,
        file=file,
        admin_id=admin_id,
    )

@router.get(
    "/{assignment_id}/submissions",
    response_model=SubmissionListResponse,
    summary="[Admin] List all submissions for an assignment",
)
async def list_submissions(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_admin_user),
):
    
    items = await assignment_service.list_submissions_for_assignment(db, assignment_id)
    return SubmissionListResponse(total=len(items), items=items)

@router.put(
    "/submissions/{submission_id}/review",
    response_model=SubmissionResponse,
    summary="[Admin] Review a submission",
)
async def review_submission(
    submission_id: int,
    payload: ReviewRequest,
    db: AsyncSession = Depends(get_db),
    admin_id: int = Depends(get_current_admin_user),
):
    
    return await assignment_service.review_submission(db, submission_id, payload, admin_id)


# ================================================================== #
# Admin — List assignments (by CourseDay)
# ================================================================== #


@router.get(
    "",
    response_model=AssignmentListResponse,
    summary="[Admin] List assignments for a CourseDay",
)
async def list_assignments_admin(
    course_day_id: int = Query(..., description="Filter by CourseDay ID"),
    active_only: bool = Query(True, description="Return only active assignments"),
    db: AsyncSession = Depends(get_db),
    _: int = Depends(get_current_admin_user),
):
    """
    Admin view of assignments — no lock check applied.
    """
    items = await assignment_service.list_assignments_for_day(db, course_day_id, active_only)
    return AssignmentListResponse(total=len(items), items=items)


# ================================================================== #
# Trainee — Assignment access
# ================================================================== #


@router.get(
    "/trainee/assignments",
    response_model=AssignmentListResponse,
    summary="[Trainee] List assignments for a CourseDay",
)
async def list_assignments_trainee(
    course_day_id: int = Query(..., description="Filter by CourseDay ID"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_trainee_user),
):
    """
    Returns active assignments for the given CourseDay.

    Access is locked until the trainee has completed ALL LearningUnits
    of that CourseDay.  Returns HTTP 403 otherwise.
    """
    items = await assignment_service.list_assignments_for_trainee(db, course_day_id, user_id)
    return AssignmentListResponse(total=len(items), items=items)


@router.get(
    "/trainee/assignments/{assignment_id}/download",
    summary="[Trainee] Download the assignment brief / template file",
)
async def download_assignment_file(
    assignment_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_trainee_user),
):
    
    file_path = await assignment_service.get_assignment_file_path(db, assignment_id, user_id)
    return FileResponse(
        path=file_path,
        filename=Path(file_path).name,
        media_type="application/octet-stream",
    )


@router.post(
    "/trainee/assignments/{assignment_id}/submit",
    response_model=SubmissionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="[Trainee] Submit completed assignment",
)
async def submit_assignment(
    assignment_id: int,
    file: UploadFile = File(..., description="PDF, DOC, DOCX, or ZIP — max 20 MB"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_trainee_user),
):
   
    return await assignment_service.submit_assignment(db, assignment_id, user_id, file)


@router.get(
    "/trainee/my-submissions",
    response_model=SubmissionListResponse,
    summary="[Trainee] View all my submissions",
)
async def my_submissions(
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_trainee_user),
):
    
    items = await assignment_service.list_my_submissions(db, user_id)
    return SubmissionListResponse(total=len(items), items=items)