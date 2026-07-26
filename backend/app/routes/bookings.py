from datetime import date
import re
from fastapi import APIRouter, HTTPException, status, Depends
from app.database import bookings_collection, homestays_collection
from app.models.booking import Booking
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)

def serialize_document(document):
    document = document.copy()
    if "_id" in document:
        document["_id"] = str(document["_id"])
    return document

def validate_booking(data):
    homestay = homestays_collection.find_one(
        {"id": data["homestay_id"]}
    )
    if not homestay:
        raise HTTPException(
            status_code=404,
            detail="Homestay not found"
        )
    room = next(
        (
            r
            for r in homestay["rooms"]
            if r["id"] == data["room_id"]
        ),
        None,
    )
    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )
    if not re.fullmatch(r"\d{10}", data["phone"]):
        raise HTTPException(
            status_code=400,
            detail="Phone number must be exactly 10 digits."
        )
    if data["check_in"] < date.today():
        raise HTTPException(
            status_code=400,
            detail="Check-in cannot be before today."
        )
    if data["check_out"] <= data["check_in"]:
        raise HTTPException(
            status_code=400,
            detail="Check-out must be after check-in."
        )
    if data["guests"] > room["capacity"]:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {room['capacity']} guests allowed for this room."
        )

@router.get("/")
def get_bookings(
    current_user=Depends(get_current_user)
):
    bookings = list(
        bookings_collection.find(
            {"user_id": current_user["id"]}
        )
    )
    results = []
    for booking in bookings:
        homestay = homestays_collection.find_one(
            {"id": booking["homestay_id"]}
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
        results.append(
            serialize_document(booking_data)
        )
    return results

@router.get("/{booking_id}")
def get_booking(
    booking_id: int,
    current_user=Depends(get_current_user)
):
    booking = bookings_collection.find_one(
        {
            "id": booking_id,
            "user_id": current_user["id"],
        }
    )
    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )
    homestay = homestays_collection.find_one(
        {"id": booking["homestay_id"]}
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
    return serialize_document(booking_data)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(
    booking: Booking,
    current_user=Depends(get_current_user)
):
    new_booking = booking.model_dump()
    validate_booking(new_booking)
    last_booking = bookings_collection.find_one(sort=[("id", -1)])
    new_booking["id"] = (
        last_booking["id"] + 1
        if last_booking
        else 1
    )

    # Store the logged-in user with the booking
    new_booking["user_id"] = current_user["id"]
    new_booking["user_email"] = current_user["email"]
    new_booking["status"] = "Pending"
    new_booking["check_in"] = str(new_booking["check_in"])
    new_booking["check_out"] = str(new_booking["check_out"])
    result = bookings_collection.insert_one(new_booking)
    new_booking["_id"] = str(result.inserted_id)
    return {
        "message": "Booking created successfully",
        "booking": new_booking
    }


@router.put("/{booking_id}")
def update_booking(
    booking_id: int,
    updated_booking: dict,
    current_user=Depends(get_current_user)
):
    booking = bookings_collection.find_one(
        {
            "id": booking_id,
            "user_id": current_user["id"],
        }
    )
    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )
    updated_data = booking.copy()
    updated_data.update(updated_booking)
    if "_id" in updated_data:
        updated_data.pop("_id")
    if isinstance(updated_data["check_in"], str):
        updated_data["check_in"] = date.fromisoformat(
            updated_data["check_in"]
        )
    if isinstance(updated_data["check_out"], str):
        updated_data["check_out"] = date.fromisoformat(
            updated_data["check_out"]
        )
    validate_booking(updated_data)
    updated_booking["check_in"] = str(updated_data["check_in"])
    updated_booking["check_out"] = str(updated_data["check_out"])
    bookings_collection.update_one(
        {
            "id": booking_id,
            "user_id": current_user["id"],
        },
        {
            "$set": updated_booking
        }
    )
    updated = bookings_collection.find_one(
        {
            "id": booking_id,
            "user_id": current_user["id"],
        }
    )
    return {
        "message": "Booking updated successfully",
        "booking": serialize_document(updated)
    }

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: int,
    current_user=Depends(get_current_user)
):
    result = bookings_collection.delete_one(
        {
            "id": booking_id,
            "user_id": current_user["id"],
        }
    )
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )
    return