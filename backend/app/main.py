import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.utils.rate_limiter import limiter
from app.routes.homestays import router as homestay_router
from app.routes.bookings import router as booking_router
from app.routes.saved import router as saved_router
from app.routes import planner
from app.routes import auth
from app.utils.error_handler import generic_exception_handler

app = FastAPI(title="TravelTrail API")

# Rate Limiter
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Session Middleware (Google OAuth)
# same_site="none" + https_only=True are required because the frontend
# (Vercel) and backend live on different domains — without these the
# browser drops the session cookie on the redirect back from Google.
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET"),
    same_site="none",
    https_only=True,
)

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(homestay_router)
app.include_router(booking_router)
app.include_router(saved_router)
app.include_router(planner.router)
app.include_router(auth.router)

# Error Handler
app.add_exception_handler(Exception, generic_exception_handler)


@app.get("/")
def root():
    return {"message": "TravelTrail API Running"}