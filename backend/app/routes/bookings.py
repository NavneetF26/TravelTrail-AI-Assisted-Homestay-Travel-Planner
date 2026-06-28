from fastapi import APIRouter, HTTPException, status

from app.data.mock_data import bookings, homestays
from app.models.booking import Booking

router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


@router.get("/")
def get_bookings():
    results = []

    for booking in bookings:
        homestay = next(
            (
                h
                for h in homestays
                if h["id"] == booking["homestay_id"]
            ),
            None,
        )

        booking_data = booking.copy()

        if homestay:
            booking_data["homestay_name"] = homestay["name"]
            booking_data["location"] = homestay["location"]

            room = next(
                (
                    r
                    for r in homestay["rooms"]
                    if r["id"] == booking["room_id"]
                ),
                None,
            )

            if room:
                booking_data["room_type"] = room["name"]

        results.append(booking_data)

    return results

@router.get("/{booking_id}")
def get_booking(booking_id: int):

    booking = next(
        (b for b in bookings if b["id"] == booking_id),
        None,
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    homestay = next(
        (
            h
            for h in homestays
            if h["id"] == booking["homestay_id"]
        ),
        None,
    )

    booking_data = booking.copy()

    if homestay:
        booking_data["homestay_name"] = homestay["name"]
        booking_data["location"] = homestay["location"]

        room = next(
            (
                r
                for r in homestay["rooms"]
                if r["id"] == booking["room_id"]
            ),
            None,
        )

        if room:
            booking_data["room_type"] = room["name"]

    return booking_data

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(booking: Booking):

    new_booking = booking.model_dump()

    new_booking["id"] = len(bookings) + 1
    new_booking["status"] = "Pending"

    bookings.append(new_booking)

    return {
        "message": "Booking created successfully",
        "booking": new_booking
    }


@router.put("/{booking_id}")
def update_booking(booking_id: int, updated_booking: dict):

    booking = next(
        (b for b in bookings if b["id"] == booking_id),
        None
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    booking.update(updated_booking)

    return {
        "message": "Booking updated successfully",
        "booking": booking
    }


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int):

    booking = next(
        (b for b in bookings if b["id"] == booking_id),
        None
    )

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    bookings.remove(booking)