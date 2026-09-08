from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

from app.database.session import get_db
from app.core.dependencies import get_current_trainer, get_current_user

from app.schemas.trainer import (
    DashboardOverviewResponse,
    BatchResponse,
    BatchDetailResponse,
    BatchTraineeResponse,
)
from app.schemas.trainee_feedback import (
    TraineeFeedbackCreate,
    TraineeFeedbackResponse,
)
from app.schemas.trainer_ranking import BatchRankingResponse

from app.services.trainer_service import (
    get_dashboard_overview,
    get_batches,
    get_batch_by_id,
    get_batch_trainees,
    get_trainee_batches,
    get_trainer_grading_queue,
)
from app.services.trainer_ranking_service import get_batch_candidate_rankings
from app.services.trainee_feedback_service import (
    create_trainee_feedback,
    get_trainee_feedback_history,
)

router = APIRouter(
    prefix="/api/trainer",
    tags=["Trainer"],
)



# --------------------------------------------------
# Dashboard Overview
# --------------------------------------------------

@router.get(
    "/overview",
    response_model=DashboardOverviewResponse,
)
async def get_dashboard_api(
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_dashboard_overview(
        db=db,
        trainer_id=current_trainer.id,
    )


# --------------------------------------------------
# Get Assigned Batches
# --------------------------------------------------

@router.get(
    "/batches",
    response_model=list[BatchResponse],
)
async def get_batches_api(
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_batches(
        db=db,
        trainer_id=current_trainer.id,
    )


@router.get(
    "/trainee/batches",
    response_model=list[BatchResponse],
)
async def get_trainee_batches_api(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.role or current_user.role.upper() != "TRAINEE":
        raise HTTPException(status_code=403, detail="Access denied. Trainee role required.")
    return await get_trainee_batches(db=db, trainee_id=current_user.id)


# --------------------------------------------------
# Get Batch Details
# --------------------------------------------------

@router.get(
    "/batches/{batch_id}",
    response_model=BatchDetailResponse,
)
async def get_batch_api(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_batch_by_id(
        db=db,
        trainer_id=current_trainer.id,
        batch_id=batch_id,
    )


# --------------------------------------------------
# Get Batch Trainees
# --------------------------------------------------

@router.get(
    "/batches/{batch_id}/trainees",
    response_model=list[BatchTraineeResponse],
)
async def get_batch_trainees_api(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_batch_trainees(
        db=db,
        trainer_id=current_trainer.id,
        batch_id=batch_id,
    )


# --------------------------------------------------
# Get Grading Queue
# --------------------------------------------------

@router.get(
    "/grading-queue",
)
async def get_grading_queue_api(
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_trainer_grading_queue(
        db=db,
        trainer_id=current_trainer.id,
    )


# --------------------------------------------------
# Candidate Rankings (Automatic Evaluation)
# --------------------------------------------------

@router.get(
    "/batches/{batch_id}/rankings",
    response_model=BatchRankingResponse,
)
async def get_batch_rankings_api(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_batch_candidate_rankings(
        db=db,
        batch_id=batch_id,
        trainer_id=current_trainer.id,
    )


# --------------------------------------------------
# Trainer Feedback to Trainee
# --------------------------------------------------

@router.post(
    "/trainees/{trainee_id}/feedback",
    response_model=TraineeFeedbackResponse,
)
async def submit_trainee_feedback_api(
    trainee_id: int,
    data: TraineeFeedbackCreate,
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    feedback_record = await create_trainee_feedback(
        db=db,
        trainer_id=current_trainer.id,
        trainee_id=trainee_id,
        data=data,
    )
    # Return formatted response
    return {
        "id": feedback_record.id,
        "trainer_id": feedback_record.trainer_id,
        "trainer_name": current_trainer.name or "Trainer",
        "trainee_id": feedback_record.trainee_id,
        "batch_id": feedback_record.batch_id,
        "category": feedback_record.category,
        "rating": feedback_record.rating,
        "feedback_text": feedback_record.feedback_text,
        "strengths": feedback_record.strengths,
        "areas_of_improvement": feedback_record.areas_of_improvement,
        "created_at": feedback_record.created_at,
    }


@router.get(
    "/trainees/{trainee_id}/feedback",
    response_model=list[TraineeFeedbackResponse],
)
async def get_trainee_feedback_api(
    trainee_id: int,
    db: AsyncSession = Depends(get_db),
    current_trainer: User = Depends(get_current_trainer),
):
    return await get_trainee_feedback_history(
        db=db,
        trainee_id=trainee_id,
    )


# --------------------------------------------------
# Trainee View: My Received Feedback
# --------------------------------------------------

@router.get(
    "/my-feedback",
    response_model=list[TraineeFeedbackResponse],
)
async def get_my_feedback_api(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await get_trainee_feedback_history(
        db=db,
        trainee_id=current_user.id,
    )