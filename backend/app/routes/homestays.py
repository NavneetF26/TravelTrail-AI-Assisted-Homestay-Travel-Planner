from fastapi import APIRouter, HTTPException, Depends
from app.database import homestays_collection
from app.models.homestay import Homestay
from app.utils.auth import get_current_user

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

@router.get("/my")
def get_my_homestays(
    current_user=Depends(get_current_user),
):
    homes = list(
        homestays_collection.find(
            {"owner": current_user["email"]}
        )
    )
    return [
        serialize_homestay(home)
        for home in homes
    ]

@router.post("/")
def create_homestay(
    homestay: Homestay,
    current_user=Depends(get_current_user),
):
    data = homestay.model_dump(exclude={"id"})
    data["owner"] = current_user["email"]
    last = homestays_collection.find_one(
        sort=[("id", -1)]
    )
    data["id"] = (last["id"] + 1) if last else 1
    homestays_collection.insert_one(data)
    return serialize_homestay(data)

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
            homestays = [h for h in homestays if 1000 <= h["price"] <= 2000]
        elif budget == "₹2000 - ₹3000":
            homestays = [h for h in homestays if 2000 <= h["price"] <= 3000]
        elif budget == "₹3000 - ₹5000":
            homestays = [h for h in homestays if 3000 <= h["price"] <= 5000]
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

@router.put("/{homestay_id}")
def update_homestay(
    homestay_id: int,
    homestay: Homestay,
    current_user=Depends(get_current_user),
):
    existing = homestays_collection.find_one(
        {"id": homestay_id}
    )
    if not existing:
        raise HTTPException(404, "Homestay not found")
    if existing.get("owner") != current_user["email"]:
        raise HTTPException(403, "Not authorized")
    data = homestay.model_dump(exclude={"id"})
    data["id"] = homestay_id
    data["owner"] = current_user["email"]
    homestays_collection.replace_one(
        {"id": homestay_id},
        data,
    )
    return serialize_homestay(data)

@router.delete("/{homestay_id}")
def delete_homestay(
    homestay_id: int,
    current_user=Depends(get_current_user),
):
    existing = homestays_collection.find_one(
        {"id": homestay_id}
    )
    if not existing:
        raise HTTPException(404, "Homestay not found")
    if existing.get("owner") != current_user["email"]:
        raise HTTPException(403, "Not authorized")
    homestays_collection.delete_one(
        {"id": homestay_id}
    )
    return {
        "message": "Homestay deleted"
    }