from fastapi import FastAPI

from app.core.config import settings
from app.routers.auth import router as auth_router
from app.routers.course import router as course_router
from app.routers.progress import router as progress_router


from app.routers.schedule import router as schedule_router

from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads"
)

app.include_router(auth_router)
app.include_router(course_router)
app.include_router(progress_router)

app.include_router(schedule_router)

@app.get("/")
async def health_check():
    return {"status": "running"}
