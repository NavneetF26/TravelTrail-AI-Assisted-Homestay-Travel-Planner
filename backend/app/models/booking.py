from datetime import date
from pydantic import BaseModel, EmailStr


class Booking(BaseModel):
    homestay_id: int
    room_id: int
    full_name: str
    email: EmailStr
    phone: str
    check_in: date
    check_out: date
    guests: int