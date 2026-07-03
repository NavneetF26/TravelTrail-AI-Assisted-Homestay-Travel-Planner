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
    results = list(homestays_collection.find())

    if q:
        results = [
            h for h in results
            if q.lower() in h["name"].lower()
            or q.lower() in h["location"].lower()
        ]

    if location:
        results = [
            h for h in results
            if location.lower() in h["location"].lower()
        ]

    if budget:

        if budget == "₹1000 - ₹2000":
            results = [
                h for h in results
                if 1000 <= h["price"] <= 2000
            ]

        elif budget == "₹2000 - ₹3000":
            results = [
                h for h in results
                if 2000 <= h["price"] <= 3000
            ]

        elif budget == "₹3000 - ₹5000":
            results = [
                h for h in results
                if 3000 <= h["price"] <= 5000
            ]

    return [
        serialize_homestay(homestay)
        for homestay in results
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