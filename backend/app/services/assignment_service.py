import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

import aiofiles
from fastapi import HTTPException, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.assignment import Assignment
from app.models.assignment_submission import AssignmentSubmission, SubmissionStatus
from app.schemas.assignment import AssignmentCreate, ReviewRequest
from app.models.course_day import CourseDay
from app.models.user import User


from sqlalchemy import select, func

from app.models.learning_unit import LearningUnit
from app.models.progress import Progress


ASSIGNMENT_FILE_ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
SUBMISSION_FILE_ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".zip"}
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB

# Base directories for stored files (configure via env in production).
ASSIGNMENT_UPLOAD_DIR = Path(os.getenv("ASSIGNMENT_UPLOAD_DIR", "uploads/assignments"))
SUBMISSION_UPLOAD_DIR = Path(os.getenv("SUBMISSION_UPLOAD_DIR", "uploads/submissions"))


def _validate_file(
    file: UploadFile,
    allowed_extensions: set[str],
    max_size: int = MAX_FILE_SIZE_BYTES,
) -> None:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"File type '{suffix}' is not allowed. "
                f"Allowed: {', '.join(sorted(allowed_extensions))}"
            ),
        )
    # Content-Length may not always be present; the hard limit is enforced
    # during streaming in `_save_upload`.
    if file.size and file.size > max_size:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {max_size // (1024 * 1024)} MB.",
        )


async def _save_upload(file: UploadFile, destination_dir: Path) -> str:
   
    destination_dir.mkdir(parents=True, exist_ok=True)

    suffix = Path(file.filename or "file").suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{suffix}"
    file_path = destination_dir / unique_name

    total_bytes = 0
    chunk_size = 1024 * 64  # 64 KB chunks

    async with aiofiles.open(file_path, "wb") as out:
        while chunk := await file.read(chunk_size):
            total_bytes += len(chunk)
            if total_bytes > MAX_FILE_SIZE_BYTES:
                # Clean up partial file before raising
                await out.close()
                file_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.",
                )
            await out.write(chunk)

    # Return a path string relative to project root (or absolute — match your convention).
    return str(file_path)


# ================================================================== #
# Assignment Unlock Logic (placeholder)
# ================================================================== #


async def is_day_completed(
    db: AsyncSession,
    user_id: int,
    course_day_id: int,
) -> bool:

    # Total learning units in this day
    total_stmt = (
        select(func.count())
        .select_from(LearningUnit)
        .where(LearningUnit.day_id == course_day_id)
    )

    total_units = (await db.execute(total_stmt)).scalar_one()

    # Completed units by this user
    completed_stmt = (
        select(func.count())
        .select_from(Progress)
        .join(
            LearningUnit,
            Progress.learning_unit_id == LearningUnit.id
        )
        .where(
            LearningUnit.day_id == course_day_id,
            Progress.user_id == user_id,
            Progress.is_completed.is_(True),
        )
    )

    completed_units = (await db.execute(completed_stmt)).scalar_one()

    return total_units > 0 and completed_units == total_units


async def _assert_day_completed(
    db: AsyncSession,
    user_id: int,
    course_day_id: int,
) -> None:
    
    completed = await is_day_completed(db, user_id, course_day_id)
    if not completed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Complete all learning units before accessing this assignment.",
        )


# ================================================================== #
# Assignment CRUD
# ================================================================== #
async def create_assignment(
    db: AsyncSession,
    course_day_id: int,
    title: str,
    description: str | None,
    due_date: datetime | None,
    file: UploadFile,
    admin_id: int,
) -> Assignment:

    course_day = await db.get(CourseDay, course_day_id)

    if not course_day:
        raise HTTPException(
        status_code=404,
        detail="Course day not found"
    )
    _validate_file(file, ASSIGNMENT_FILE_ALLOWED_EXTENSIONS)

    saved_path = await _save_upload(file, ASSIGNMENT_UPLOAD_DIR)

    assignment = Assignment(
        course_day_id=course_day_id,
        title=title,
        description=description,
        due_date=due_date,
        file_path=saved_path,
        is_active=True,
        created_by=admin_id,
    )

    db.add(assignment)
    await db.commit()
    await db.refresh(assignment)

    return assignment

from pathlib import Path
from fastapi import HTTPException, status

async def list_assignments_for_day(
    db: AsyncSession,
    course_day_id: int,
    active_only: bool = True,
) -> List[Assignment]:
    """Return all assignments for a given CourseDay (admin view, no lock check)."""
    stmt = select(Assignment).where(Assignment.course_day_id == course_day_id)
    if active_only:
        stmt = stmt.where(Assignment.is_active.is_(True))
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def list_assignments_for_trainee(
    db: AsyncSession,
    course_day_id: int,
    user_id: int,
) -> List[Assignment]:
    
    await _assert_day_completed(db, user_id, course_day_id)
    return await list_assignments_for_day(db, course_day_id, active_only=True)


# ================================================================== #
# Submission CRUD
# ================================================================== #


async def submit_assignment(
    db: AsyncSession,
    assignment_id: int,
    user_id: int,
    file: UploadFile,
) -> AssignmentSubmission:
    
    assignment = await _get_assignment_or_404(db, assignment_id, active_only=True)

    user = await db.get(User, user_id)

    if not user:
        raise HTTPException(
        status_code=404,
        detail="User not found"
    )
    # Enforce day-completion lock before accepting a submission.
    await _assert_day_completed(db, user_id, assignment.course_day_id)

    _validate_file(file, SUBMISSION_FILE_ALLOWED_EXTENSIONS)
    saved_path = await _save_upload(file, SUBMISSION_UPLOAD_DIR)

    submission = AssignmentSubmission(
        assignment_id=assignment_id,
        user_id=user_id,
        file_path=saved_path,
        status=SubmissionStatus.SUBMITTED,
        submitted_at=datetime.now(timezone.utc),
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return submission


async def list_submissions_for_assignment(
    db: AsyncSession,
    assignment_id: int,
) -> List[AssignmentSubmission]:
    """Admin views all submissions for a specific assignment."""
    await _get_assignment_or_404(db, assignment_id)  # ensure assignment exists
    stmt = (
        select(AssignmentSubmission)
        .where(AssignmentSubmission.assignment_id == assignment_id)
        .order_by(AssignmentSubmission.submitted_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def list_my_submissions(
    db: AsyncSession,
    user_id: int,
) -> List[AssignmentSubmission]:
    """Trainee views their own submissions across all assignments."""
    stmt = (
        select(AssignmentSubmission)
        .where(AssignmentSubmission.user_id == user_id)
        .order_by(AssignmentSubmission.submitted_at.desc())
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def review_submission(
    db: AsyncSession,
    submission_id: int,
    payload: ReviewRequest,
    admin_id: int,
) -> AssignmentSubmission:

    PASS_MARK = 75

    submission = await _get_submission_or_404(db, submission_id)

    submission.marks = payload.marks
    submission.review_comments = payload.review_comments

    user = await db.get(User, admin_id)

    if not user:
        raise HTTPException(
        status_code=404,
        detail="Reviewer not found"
    )

    submission.reviewed_by = admin_id
    submission.reviewed_at = datetime.now(timezone.utc)

    if payload.marks is None:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Marks are required for review."
    )

    if payload.marks >= PASS_MARK:
        submission.status = SubmissionStatus.PASSED
    else:
        submission.status = SubmissionStatus.FAILED

    await db.commit()
    await db.refresh(submission)

    return submission

# ================================================================== #
# Download helpers
# ================================================================== #


async def get_assignment_file_path(
    db: AsyncSession,
    assignment_id: int,
    user_id: int,
) -> str:
    assignment = await _get_assignment_or_404(db, assignment_id, active_only=True)
    await _assert_day_completed(db, user_id, assignment.course_day_id)

    if not assignment.file_path or not Path(assignment.file_path).exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No file has been uploaded for this assignment yet.",
        )
    return assignment.file_path


# ================================================================== #
# Internal helpers
# ================================================================== #


async def _get_assignment_or_404(
    db: AsyncSession,
    assignment_id: int,
    active_only: bool = False,
) -> Assignment:
    stmt = select(Assignment).where(Assignment.id == assignment_id)
    if active_only:
        stmt = stmt.where(Assignment.is_active.is_(True))
    result = await db.execute(stmt)
    assignment = result.scalar_one_or_none()
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assignment {assignment_id} not found.",
        )
    return assignment


async def _get_submission_or_404(
    db: AsyncSession,
    submission_id: int,
) -> AssignmentSubmission:
    stmt = select(AssignmentSubmission).where(AssignmentSubmission.id == submission_id)
    result = await db.execute(stmt)
    submission = result.scalar_one_or_none()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Submission {submission_id} not found.",
        )
    return submission