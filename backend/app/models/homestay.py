from pydantic import BaseModel, Field, field_validator
from typing import List, Optional

class Room(BaseModel):
    id: int
    name: str = Field(..., min_length=1)
    price: int = Field(..., gt=0)
    capacity: int = Field(..., gt=0)
    beds: str = Field(..., min_length=1)
    size: str = Field(..., min_length=1)
    image: str = Field(..., min_length=1)
    features: List[str] = []

class Attraction(BaseModel):
    name: str = Field(..., min_length=1)
    distance: str = Field(..., min_length=1)
    image: str = Field(..., min_length=1)

class Homestay(BaseModel):
    id: Optional[int] = None
    owner: Optional[str] = None
    name: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    price: int = Field(..., gt=0)
    rating: Optional[float] = 0.0
    description: str = Field(..., min_length=1)
    images: List[str] = Field(..., min_length=1)
    amenities: List[str] = Field(..., min_length=1)
    nearby_attractions: List[Attraction] = Field(..., min_length=1)
    rooms: List[Room] = Field(..., min_length=1)
    @field_validator("images")
    @classmethod
    def strip_blank_images(cls, v):
        cleaned = [i for i in v if i and i.strip()]
        if not cleaned:
            raise ValueError("At least one image is required")
        return cleaned