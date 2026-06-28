from pydantic import BaseModel
from typing import List


class Room(BaseModel):
    id: int
    name: str
    price: int
    capacity: int
    beds: str
    size: str
    image: str
    features: List[str]


class Attraction(BaseModel):
    name: str
    distance: str
    image: str


class Amenity(BaseModel):
    icon: str
    name: str


class Homestay(BaseModel):
    id: int
    name: str
    location: str
    rating: float
    price: int
    description: str
    images: List[str]
    amenities: List[Amenity]
    nearby_attractions: List[Attraction]
    rooms: List[Room]