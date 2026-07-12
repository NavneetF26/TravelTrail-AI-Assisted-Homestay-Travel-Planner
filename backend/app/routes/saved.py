from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import (
    saved_homestays_collection,
    homestays_collection,
)
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/api/saved",
    tags=["Saved Homestays"],
)


@router.post("/{homestay_id}")
def save_homestay(
    homestay_id: int,
    current_user=Depends(get_current_user),
):

    homestay = homestays_collection.find_one(
        {"id": homestay_id}
    )

    if not homestay:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homestay not found",
        )

    existing = saved_homestays_collection.find_one(
        {
            "user_id": current_user["id"],
            "homestay_id": homestay_id,
        }
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Homestay already saved",
        )

    last_saved = saved_homestays_collection.find_one(
        sort=[("id", -1)]
    )

    new_id = 1

    if last_saved:
        new_id = last_saved["id"] + 1

    saved_homestays_collection.insert_one(
        {
            "id": new_id,
            "user_id": current_user["id"],
            "homestay_id": homestay_id,
            "saved_at": datetime.now(timezone.utc),
        }
    )

    return {
        "message": "Homestay saved successfully"
    }


@router.delete("/{homestay_id}")
def remove_saved_homestay(
    homestay_id: int,
    current_user=Depends(get_current_user),
):

    result = saved_homestays_collection.delete_one(
        {
            "user_id": current_user["id"],
            "homestay_id": homestay_id,
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved homestay not found",
        )

    return {
        "message": "Homestay removed from saved list"
    }


@router.get("/")
def get_saved_homestays(
    current_user=Depends(get_current_user),
):

    saved = saved_homestays_collection.find(
        {
            "user_id": current_user["id"]
        }
    )

    results = []

    for item in saved:

        homestay = homestays_collection.find_one(
            {
                "id": item["homestay_id"]
            },
            {
                "_id": 0,
            }
        )

        if homestay:
            results.append(homestay)

    return results


@router.get("/{homestay_id}")
def is_saved(
    homestay_id: int,
    current_user=Depends(get_current_user),
):

    saved = saved_homestays_collection.find_one(
        {
            "user_id": current_user["id"],
            "homestay_id": homestay_id,
        }
    )

    return {
        "saved": saved is not None
    }

    