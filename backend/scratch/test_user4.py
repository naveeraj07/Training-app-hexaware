import asyncio
import sys

sys.path.insert(0, r"c:\Training-app-hexaware\backend")
from app.database.session import AsyncSessionLocal
from app.services.schedule_service import get_user_schedule

async def main():
    async with AsyncSessionLocal() as db:
        overall = await get_user_schedule(db, user_id=4, week=0, course_id=None)
        print('=== OVERALL SCHEDULE (user_id=4) ===')
        print('Course:', overall.get('course_name'))
        for day in overall.get('schedule', []):
            print(f"Day {day['day_number']} ({day['weekday']} - {day['date']}): {len(day['sessions'])} sessions")
            for s in day['sessions']:
                print(f"   [{s['course_name']}] {s['start_time']}-{s['end_time']} : {s['title']}")

if __name__ == "__main__":
    asyncio.run(main())
