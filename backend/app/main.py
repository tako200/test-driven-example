from fastapi import FastAPI

from app.api import health

app = FastAPI(title="TDD Hands-on")
app.include_router(health.router)
