from fastapi import FastAPI

from app.core.config import settings
from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(profile_router)




@app.get("/")
async def health_check():
    return {"status": "running"}