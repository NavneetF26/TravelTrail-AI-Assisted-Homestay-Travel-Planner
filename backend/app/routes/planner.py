import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-lite-latest")

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Planner"]
)

class TravelPlanRequest(BaseModel):
    destination: str = Field(..., min_length=2)
    budget: str
    duration: str
    interests: str
    preferences: str = ""


@router.post("/travel-plan")
def generate_travel_plan(request: TravelPlanRequest):
    prompt = f"""
You are an expert travel planner specializing in tourism in Uttarakhand, India.

Generate a realistic and personalized day-wise travel itinerary.

Destination:
{request.destination}

Budget:
₹{request.budget}

Duration:
{request.duration}

Interests:
{request.interests}

Additional Preferences:
{request.preferences}

Requirements:
- Stay within the given budget.
- Recommend popular attractions.
- Suggest local food if relevant.
- Mention approximate timings.
- Keep travel realistic.
- Return ONLY valid JSON.
- Do not include markdown, explanations, or code fences.

Return exactly in this format:

{{
  "days": [
    {{
      "day": "Day 1",
      "title": "Arrival",
      "activities": [
        "Activity 1",
        "Activity 2",
        "Activity 3"
      ]
    }}
  ]
}}
"""

    try:
        response = model.generate_content(prompt)
        ai_response = response.text
        # Remove markdown code fences if Gemini returns them
        ai_response = (
            ai_response.replace("```json", "")
            .replace("```", "")
            .strip()
        )
        # Validate JSON
        plan = json.loads(ai_response)
        return plan

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="AI returned an invalid response."
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )