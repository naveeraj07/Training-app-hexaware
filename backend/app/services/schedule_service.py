import time
from datetime import timedelta, date
from collections import defaultdict

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course
from app.models.course_day import CourseDay
from app.models.learning_unit import LearningUnit
from app.models.enrollment import Enrollment
from app.models.progress import Progress


TIME_SLOTS = [
    ("09:00", "10:30"),
    ("10:45", "12:15"),
    ("12:30", "14:00"),
    ("14:15", "15:45"),
    ("16:00", "17:30"),
    ("17:45", "19:15"),
    ("19:30", "21:00")
]

_schedule_cache = {}
_SCHEDULE_CACHE_TTL = 10  # seconds


async def get_user_schedule(
    db: AsyncSession,
    user_id: int,
    week: int = 0,
    course_id: int | None = None
):
    cache_key = f"sched_{user_id}_{week}_{course_id or 'all'}"
    now_ts = time.time()
    if cache_key in _schedule_cache:
        cached_data, cached_time = _schedule_cache[cache_key]
        if now_ts - cached_time < _SCHEDULE_CACHE_TTL:
            return cached_data

    if course_id is not None:
        # ----------------------------------------------------
        # INDIVIDUAL COURSE SCHEDULE
        # ----------------------------------------------------
        enrollment_stmt = (
            select(Enrollment, Course)
            .join(Course, Course.id == Enrollment.course_id)
            .where(
                Enrollment.user_id == user_id,
                Enrollment.course_id == course_id
            )
            .order_by(Enrollment.enrolled_at.desc())
            .limit(1)
        )
        row = (await db.execute(enrollment_stmt)).first()

        if not row:
            c_res = await db.execute(select(Course).where(Course.id == course_id))
            course = c_res.scalar_one_or_none()
            if not course:
                raise ValueError("Course not found")
            from datetime import datetime
            enrollment = Enrollment(user_id=user_id, course_id=course.id, enrolled_at=datetime.utcnow())
        else:
            enrollment, course = row

        course_days = (
            await db.scalars(
                select(CourseDay)
                .where(CourseDay.course_id == course.id)
                .order_by(CourseDay.day_number)
            )
        ).all()

        day_ids = [day.id for day in course_days]
        units_by_day = {}
        all_units = []

        if day_ids:
            all_units = (
                await db.scalars(
                    select(LearningUnit)
                    .where(LearningUnit.day_id.in_(day_ids))
                    .order_by(LearningUnit.display_order)
                )
            ).all()

            for unit in all_units:
                units_by_day.setdefault(unit.day_id, []).append(unit)

        progress_by_unit = {}
        unit_ids = [unit.id for unit in all_units]
        if unit_ids:
            all_progress = (
                await db.scalars(
                    select(Progress)
                    .where(
                        Progress.user_id == user_id,
                        Progress.learning_unit_id.in_(unit_ids),
                        Progress.is_completed.is_(True)
                    )
                )
            ).all()
            for progress in all_progress:
                progress_by_unit[progress.learning_unit_id] = progress

        schedule = []
        day_progress_map = {}
        start_day = week * 7 + 1
        end_day = (week + 1) * 7

        for day in course_days:
            units = units_by_day.get(day.id, [])
            actual_date = (
                enrollment.enrolled_at.date() + timedelta(days=day.day_number - 1)
            )
            sessions = []
            completed_count = 0
            completed_dates = []

            for index, unit in enumerate(units):
                progress = progress_by_unit.get(unit.id)
                if progress:
                    completed_count += 1
                    if progress.completed_at:
                        completed_dates.append(progress.completed_at)

                slot_index = min(index, len(TIME_SLOTS) - 1)
                start_time, end_time = TIME_SLOTS[slot_index]

                sessions.append({
                    "learning_unit_id": unit.id,
                    "title": unit.title,
                    "start_time": start_time,
                    "end_time": end_time,
                    "duration_minutes": unit.duration_minutes or 0,
                    "completed": progress is not None,
                    "course_id": course.id,
                    "course_name": course.title
                })

            day_progress_map[day.id] = {
                "total_modules": len(units),
                "completed_modules": completed_count,
                "completed_at_max": max(completed_dates) if completed_dates else None
            }

            status = "upcoming"
            if len(units) > 0:
                if completed_count == len(units):
                    status = "completed"
                elif completed_count > 0:
                    status = "current"

            if start_day <= day.day_number <= end_day and actual_date.weekday() < 5:
                schedule.append({
                    "day_number": day.day_number,
                    "date": actual_date,
                    "weekday": actual_date.strftime("%A"),
                    "title": day.title,
                    "status": status,
                    "sessions": sessions
                })

        from app.services.dashboard_service import calculate_unlocked_day
        current_day = calculate_unlocked_day(course_days, day_progress_map)
        total_hours = round(sum(unit.duration_minutes or 0 for unit in all_units) / 60, 1)

        result = {
            "course_id": course.id,
            "course_name": course.title,
            "start_date": enrollment.enrolled_at.date(),
            "end_date": enrollment.enrolled_at.date() + timedelta(days=max(course.duration_days - 1, 0)),
            "current_day": current_day,
            "summary": {
                "total_modules": len(all_units),
                "total_sections": len(all_units),
                "total_days": len(course_days),
                "total_hours": total_hours
            },
            "schedule": schedule
        }
        _schedule_cache[cache_key] = (result, now_ts)
        return result

    else:
        # ----------------------------------------------------
        # OVERALL DASHBOARD SCHEDULE (ALL ASSIGNED COURSES - BULK OPTIMIZED)
        # ----------------------------------------------------
        enrollment_stmt = (
            select(Enrollment, Course)
            .join(Course, Course.id == Enrollment.course_id)
            .where(Enrollment.user_id == user_id)
            .order_by(Enrollment.enrolled_at.asc())
        )
        enrollment_courses = (await db.execute(enrollment_stmt)).all()

        if not enrollment_courses:
            today = date.today()
            return {
                "course_id": None,
                "course_name": "All Courses",
                "start_date": today,
                "end_date": today,
                "current_day": 1,
                "summary": {
                    "total_modules": 0,
                    "total_sections": 0,
                    "total_days": 0,
                    "total_hours": 0.0
                },
                "schedule": []
            }

        course_ids = [c.id for _, c in enrollment_courses]

        # Bulk fetch all CourseDays for these courses
        all_c_days = (
            await db.scalars(
                select(CourseDay)
                .where(CourseDay.course_id.in_(course_ids))
                .order_by(CourseDay.day_number)
            )
        ).all()

        days_by_course = defaultdict(list)
        all_day_ids = []
        for d in all_c_days:
            days_by_course[d.course_id].append(d)
            all_day_ids.append(d.id)

        # Bulk fetch all LearningUnits for these days
        units_by_day = defaultdict(list)
        all_units = []
        if all_day_ids:
            all_units = (
                await db.scalars(
                    select(LearningUnit)
                    .where(LearningUnit.day_id.in_(all_day_ids))
                    .order_by(LearningUnit.display_order)
                )
            ).all()
            for u in all_units:
                units_by_day[u.day_id].append(u)

        # Bulk fetch all Progress records for user
        progress_map = {}
        all_unit_ids = [u.id for u in all_units]
        if all_unit_ids:
            all_p = (
                await db.scalars(
                    select(Progress)
                    .where(
                        Progress.user_id == user_id,
                        Progress.learning_unit_id.in_(all_unit_ids),
                        Progress.is_completed.is_(True)
                    )
                )
            ).all()
            for p in all_p:
                progress_map[p.learning_unit_id] = p

        sessions_by_date = defaultdict(list)
        all_dates = set()
        total_all_modules = len(all_units)
        total_all_hours = sum(u.duration_minutes or 0 for u in all_units) / 60
        earliest_start_date = min(
            (e.enrolled_at.date() for e, _ in enrollment_courses),
            default=date.today()
        )
        latest_end_date = None

        for enrollment, course in enrollment_courses:
            # Align all assigned active courses to program schedule timeline
            start_dt = earliest_start_date

            c_days = days_by_course.get(course.id, [])
            for d in c_days:
                actual_date = start_dt + timedelta(days=d.day_number - 1)
                all_dates.add(actual_date)
                if latest_end_date is None or actual_date > latest_end_date:
                    latest_end_date = actual_date

                units = units_by_day.get(d.id, [])
                for unit in units:
                    p = progress_map.get(unit.id)
                    sessions_by_date[actual_date].append({
                        "course_id": course.id,
                        "course_name": course.title,
                        "learning_unit_id": unit.id,
                        "title": unit.title,
                        "duration_minutes": unit.duration_minutes or 0,
                        "completed": p is not None
                    })

        if earliest_start_date is None:
            earliest_start_date = date.today()
            latest_end_date = date.today()

        start_monday = earliest_start_date - timedelta(days=earliest_start_date.weekday())
        target_monday = start_monday + timedelta(weeks=week)

        week_dates = [target_monday + timedelta(days=i) for i in range(5)]

        schedule = []
        for day_idx, dt in enumerate(week_dates, start=1):
            raw_sessions = sessions_by_date.get(dt, [])
            sessions = []
            for slot_idx, session in enumerate(raw_sessions):
                slot_i = min(slot_idx, len(TIME_SLOTS) - 1)
                s_time, e_time = TIME_SLOTS[slot_i]
                sessions.append({
                    "learning_unit_id": session["learning_unit_id"],
                    "title": session["title"],
                    "start_time": s_time,
                    "end_time": e_time,
                    "duration_minutes": session["duration_minutes"],
                    "completed": session["completed"],
                    "course_id": session["course_id"],
                    "course_name": session["course_name"]
                })

            if len(sessions) > 0 and all(s["completed"] for s in sessions):
                status = "completed"
            elif any(s["completed"] for s in sessions):
                status = "current"
            else:
                status = "upcoming"

            schedule.append({
                "day_number": day_idx,
                "date": dt,
                "weekday": dt.strftime("%A"),
                "title": f"Schedule for {dt.strftime('%b %d')}",
                "status": status,
                "sessions": sessions
            })

        result = {
            "course_id": None,
            "course_name": "All Courses",
            "start_date": earliest_start_date,
            "end_date": latest_end_date or earliest_start_date,
            "current_day": (week * 5) + 1,
            "summary": {
                "total_modules": total_all_modules,
                "total_sections": total_all_modules,
                "total_days": len(all_dates),
                "total_hours": round(total_all_hours, 1)
            },
            "schedule": schedule
        }
        _schedule_cache[cache_key] = (result, now_ts)
        return result