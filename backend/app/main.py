from fastapi import FastAPI
from app.core.config import settings

app = FastAPI()

print(settings.DATABASE_URL)


@app.get("/")
async def health_check():
    return {"status": "running"}