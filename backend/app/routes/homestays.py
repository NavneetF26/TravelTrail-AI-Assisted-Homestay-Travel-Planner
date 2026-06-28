from fastapi import APIRouter, HTTPException

from app.data.mock_data import homestays

router = APIRouter(
    prefix="/api/homestays",
    tags=["Homestays"]
)


@router.get("/")
def get_homestays():
    return homestays


@router.get("/search")
def search_homestays(
    q: str = "",
    location: str = "",
    budget: str = ""
):
    results = homestays

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

    return results


@router.get("/{homestay_id}")
def get_homestay(homestay_id: int):

    homestay = next(
        (
            h
            for h in homestays
            if h["id"] == homestay_id
        ),
        None,
    )

    if not homestay:
        raise HTTPException(
            status_code=404,
            detail="Homestay not found",
        )

    return homestay