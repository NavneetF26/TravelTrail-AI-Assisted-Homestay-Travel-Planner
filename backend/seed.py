from app.database import homestays_collection
from mock_data import homestays

# Remove existing homestays (so we don't get duplicates)
homestays_collection.delete_many({})

# Insert all homestays
homestays_collection.insert_many(homestays)

print("✅ Homestays seeded successfully!")