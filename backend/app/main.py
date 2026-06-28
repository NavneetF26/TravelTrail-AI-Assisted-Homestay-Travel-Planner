from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.homestays import router as homestay_router
from app.routes.bookings import router as booking_router

from app.utils.error_handler import generic_exception_handler

app = FastAPI(title="TravelTrail API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(homestay_router)
app.include_router(booking_router)
app.add_exception_handler(
    Exception,
    generic_exception_handler
)


@app.get("/")
def root():
    return {
        "message": "TravelTrail API Running"
    }