from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.batch_models import Batch, BatchTrainee
from app.models.user import User
from app.models.course import Course
from app.models.assignment import Assignment
from app.models.assignment_submission import AssignmentSubmission, SubmissionStatus
from app.models.assessment import Assessment, AssessmentAttempt
from app.models.attendance_record import AttendanceRecord
from app.models.trainee_feedback import TraineeFeedback
from app.services.progress_service import get_course_progress


async def get_batch_candidate_rankings(
    db: AsyncSession,
    batch_id: int,
    trainer_id: int | None = None,
) -> dict:
    # 1. Fetch batch
    batch_stmt = select(Batch).where(Batch.id == batch_id)
    if trainer_id:
        batch_stmt = batch_stmt.where(Batch.trainer_id == trainer_id)
    
    batch = await db.scalar(batch_stmt)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found or unauthorized.")

    course = await db.get(Course, batch.course_id)
    course_name = course.title if course else "Course"

    # 2. Get trainees enrolled in batch
    trainees_stmt = (
        select(
            User.id,
            User.employee_id,
            User.name,
            User.email,
            BatchTrainee.joined_at,
        )
        .join(BatchTrainee, User.id == BatchTrainee.trainee_id)
        .where(BatchTrainee.batch_id == batch_id)
        .order_by(User.name)
    )
    trainees_result = await db.execute(trainees_stmt)
    trainees = trainees_result.all()

    if not trainees:
        return {
            "batch_id": batch.id,
            "batch_name": batch.name,
            "course_name": course_name,
            "total_trainees": 0,
            "batch_average_score": 0.0,
            "top_performer": None,
            "rankings": [],
        }

    candidate_items = []

    for t in trainees:
        # A. Course Progress %
        prog_data = await get_course_progress(db, course_id=batch.course_id, user_id=t.id)
        progress_pct = float(prog_data.get("progress_percentage", 0.0))

        # B. Attendance %
        attn_stmt = select(AttendanceRecord).where(AttendanceRecord.trainee_id == t.id)
        attn_records = (await db.scalars(attn_stmt)).all()
        if attn_records:
            present_or_late = sum(1 for r in attn_records if r.status.name in ["PRESENT", "LATE"])
            attendance_pct = round((present_or_late / len(attn_records)) * 100, 1)
        else:
            attendance_pct = 95.0

        # C. Assessment Average %
        assess_stmt = (
            select(AssessmentAttempt)
            .where(
                AssessmentAttempt.user_id == t.id,
                AssessmentAttempt.status == "submitted",
            )
        )
        assess_attempts = (await db.scalars(assess_stmt)).all()
        total_assessments_taken = len(assess_attempts)
        if assess_attempts:
            assess_pct_list = []
            for att in assess_attempts:
                if att.total_marks and att.total_marks > 0:
                    pct = (att.score or 0.0) / att.total_marks * 100.0
                else:
                    pct = float(att.score or 0.0)
                assess_pct_list.append(min(100.0, max(0.0, pct)))
            assessment_avg = round(sum(assess_pct_list) / len(assess_pct_list), 1)
        else:
            # Baseline when no formal assessments taken yet
            assessment_avg = 0.0

        # D. Assignment Average %
        assign_stmt = (
            select(AssignmentSubmission, Assignment.total_marks)
            .join(Assignment, Assignment.id == AssignmentSubmission.assignment_id)
            .where(
                AssignmentSubmission.user_id == t.id,
                AssignmentSubmission.status == SubmissionStatus.EVALUATED,
            )
        )
        assign_res = await db.execute(assign_stmt)
        assign_rows = assign_res.all()
        total_assignments_graded = len(assign_rows)
        if assign_rows:
            assign_pct_list = []
            for sub, tot_marks in assign_rows:
                tot = tot_marks if (tot_marks and tot_marks > 0) else 100
                score_pct = ((sub.marks or 0) / tot) * 100.0
                assign_pct_list.append(min(100.0, max(0.0, score_pct)))
            assignment_avg = round(sum(assign_pct_list) / len(assign_pct_list), 1)
        else:
            assignment_avg = 0.0

        # E. Weighted Composite Score
        # Weights: 40% Assessments, 35% Assignments, 15% Syllabus Progress, 10% Attendance
        # If neither assessments nor assignments have occurred yet for the batch,
        # proportionally weight progress & attendance so newly enrolled students aren't penalized with 0.
        has_academic_evals = (total_assessments_taken > 0 or total_assignments_graded > 0)
        if has_academic_evals:
            # Adaptive weight when only one type is present
            if total_assessments_taken > 0 and total_assignments_graded > 0:
                composite = (
                    (0.40 * assessment_avg) +
                    (0.35 * assignment_avg) +
                    (0.15 * progress_pct) +
                    (0.10 * attendance_pct)
                )
            elif total_assessments_taken > 0:
                # 60% assessments, 25% progress, 15% attendance
                composite = (
                    (0.60 * assessment_avg) +
                    (0.25 * progress_pct) +
                    (0.15 * attendance_pct)
                )
            else:
                # 60% assignments, 25% progress, 15% attendance
                composite = (
                    (0.60 * assignment_avg) +
                    (0.25 * progress_pct) +
                    (0.15 * attendance_pct)
                )
        else:
            # No assessments or assignments graded yet; rely on progress and attendance
            composite = (0.65 * progress_pct) + (0.35 * attendance_pct)

        composite_score = round(min(100.0, max(0.0, composite)), 1)

        # F. Performance Tier
        if composite_score >= 85.0:
            tier = "Top Performer"
        elif composite_score >= 65.0:
            tier = "On Track"
        else:
            tier = "Needs Attention"

        # G. Latest Feedback
        fb_stmt = (
            select(TraineeFeedback)
            .where(TraineeFeedback.trainee_id == t.id)
            .order_by(TraineeFeedback.created_at.desc())
            .limit(1)
        )
        latest_fb = await db.scalar(fb_stmt)

        candidate_items.append({
            "trainee_id": t.id,
            "employee_id": t.employee_id,
            "name": t.name or t.employee_id or "Trainee",
            "email": t.email,
            "composite_score": composite_score,
            "tier": tier,
            "breakdown": {
                "assessment_avg": assessment_avg,
                "assignment_avg": assignment_avg,
                "progress_pct": progress_pct,
                "attendance_pct": attendance_pct,
                "total_assessments_taken": total_assessments_taken,
                "total_assignments_graded": total_assignments_graded,
            },
            "last_feedback": latest_fb.feedback_text if latest_fb else None,
            "last_feedback_rating": latest_fb.rating if latest_fb else None,
        })

    # 3. Sort candidates for Ranking
    # Sort key: composite_score desc, assessment_avg desc, assignment_avg desc, progress_pct desc
    candidate_items.sort(
        key=lambda x: (
            x["composite_score"],
            x["breakdown"]["assessment_avg"],
            x["breakdown"]["assignment_avg"],
            x["breakdown"]["progress_pct"],
        ),
        reverse=True,
    )

    total_trainees = len(candidate_items)
    for idx, item in enumerate(candidate_items):
        rank = idx + 1
        item["rank"] = rank
        if total_trainees > 1:
            item["percentile"] = round(((total_trainees - rank) / (total_trainees - 1)) * 100, 1)
        else:
            item["percentile"] = 100.0

    batch_average = round(
        sum(c["composite_score"] for c in candidate_items) / total_trainees, 1
    ) if total_trainees > 0 else 0.0

    top_performer = candidate_items[0]["name"] if candidate_items else None

    return {
        "batch_id": batch.id,
        "batch_name": batch.name,
        "course_name": course_name,
        "total_trainees": total_trainees,
        "batch_average_score": batch_average,
        "top_performer": top_performer,
        "rankings": candidate_items,
    }
