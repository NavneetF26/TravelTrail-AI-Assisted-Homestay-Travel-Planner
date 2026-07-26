import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

# Load variables from .env
load_dotenv()

# Get MongoDB connection string
MONGO_URI = os.getenv("MONGO_URI")

# Create MongoDB client
client = MongoClient(
    MONGO_URI,
    server_api=ServerApi("1")
)

# Connect to database
db = client["traveltrail"]

# Collections
homestays_collection = db["homestays"]
bookings_collection = db["bookings"]
users_collection = db["users"]
saved_homestays_collection = db["saved_homestays"]

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")