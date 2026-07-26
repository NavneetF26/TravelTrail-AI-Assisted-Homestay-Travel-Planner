from fastapi import APIRouter, HTTPException
from app.database import homestays_collection

router = APIRouter(
    prefix="/api/homestays",
    tags=["Homestays"]
)


def serialize_homestay(homestay):
    homestay = homestay.copy()
    if "_id" in homestay:
        homestay["_id"] = str(homestay["_id"])
    return homestay


@router.get("/")
def get_homestays():
    homestays = list(homestays_collection.find())
    return [
        serialize_homestay(homestay)
        for homestay in homestays
    ]

@router.get("/search")
def search_homestays(
    q: str = "",
    location: str = "",
    budget: str = ""
):
    query = {}
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"location": {"$regex": q, "$options": "i"}},
        ]
    if location:
        query["location"] = {
            "$regex": location,
            "$options": "i",
        }
    homestays = list(homestays_collection.find(query))
    if budget:
        if budget == "₹1000 - ₹2000":
            homestays = [
                h for h in homestays
                if 1000 <= h["price"] <= 2000
            ]
        elif budget == "₹2000 - ₹3000":
            homestays = [
                h for h in homestays
                if 2000 <= h["price"] <= 3000
            ]
        elif budget == "₹3000 - ₹5000":
            homestays = [
                h for h in homestays
                if 3000 <= h["price"] <= 5000
            ]
    return [
        serialize_homestay(h)
        for h in homestays
    ]

@router.get("/{homestay_id}")
def get_homestay(homestay_id: int):
    homestay = homestays_collection.find_one(
        {"id": homestay_id}
    )
    if not homestay:
        raise HTTPException(
            status_code=404,
            detail="Homestay not found",
        )
    return serialize_homestay(homestay)