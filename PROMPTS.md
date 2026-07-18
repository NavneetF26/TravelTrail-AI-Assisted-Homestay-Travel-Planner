# PROMPTS.md

# TravelTrail AI – Prompt Testing Log

During the development of the AI Travel Planner, I experimented with different prompt styles before selecting the final version. The objective was to generate travel itineraries that were realistic, budget-friendly, and easy to display within the application.

---

# Prompt 1

## Prompt

You are a travel planner.

Create a travel itinerary using the following information:

- Destination
- Budget
- Trip Duration
- Interests

Generate a simple day-wise travel plan.

### Example Input

```
Destination: Mussoorie
Budget: ₹5000
Duration: 3 Days
Interests: Nature
```

### Example Output

```
Day 1
• Explore Mall Road
• Visit local cafés

Day 2
• Visit Kempty Falls
• Enjoy scenic viewpoints

Day 3
• Shopping
• Departure
```

### Observation

This prompt generated a basic itinerary, but it was quite generic. It did not make good use of the budget or provide many personalized recommendations.

---

# Prompt 2

## Prompt

You are an experienced travel planner specializing in tourism in Uttarakhand.

Generate a realistic day-wise travel itinerary using the following information.

Destination:
{destination}

Budget:
₹{budget}

Duration:
{duration}

Interests:
{interests}

Additional Preferences:
{preferences}

Requirements:

- Stay within the given budget.
- Recommend nearby attractions.
- Suggest local food whenever appropriate.
- Include approximate timings.
- Keep the travel plan realistic.

### Example Input

```
Destination: Mussoorie
Budget: ₹5000
Duration: 3 Days
Interests: Nature, Food
Additional Preferences: Vegetarian food
```

### Example Output

```
Day 1
• Check into a budget homestay
• Walk along Mall Road
• Try local vegetarian cafés

Day 2
• Visit Company Garden
• Explore Kempty Falls
• Enjoy local street food

Day 3
• Visit Gun Hill
• Shop at Kulri Bazaar
```

### Observation

This version produced much better results. The itinerary became more detailed, included food recommendations, respected the user's budget, and felt much more personalized.

---

# Prompt 3 (Final Prompt)

## Prompt

You are an expert travel planner specializing in tourism in Uttarakhand, India.

Generate a realistic and personalized day-wise travel itinerary.

Destination:
{destination}

Budget:
₹{budget}

Duration:
{duration}

Interests:
{interests}

Additional Preferences:
{preferences}

Requirements:

- Stay within the given budget.
- Recommend popular attractions.
- Suggest local food if relevant.
- Mention approximate timings.
- Keep travel realistic.
- Return ONLY valid JSON.
- Do not include markdown, explanations, or code fences.

Return exactly in this format:

```json
{
  "days": [
    {
      "day": "Day 1",
      "title": "Arrival",
      "activities": ["Activity 1", "Activity 2", "Activity 3"]
    }
  ]
}
```

### Example Input

```
Destination: Mussoorie
Budget: ₹5000
Duration: 3 Days
Interests: Nature, Food
Additional Preferences: Vegetarian food
```

### Example Output

```json
{
  "days": [
    {
      "day": "Day 1",
      "title": "Arrival and Mall Road",
      "activities": [
        "Check into a budget guesthouse",
        "Explore Mall Road",
        "Enjoy vegetarian local food"
      ]
    },
    {
      "day": "Day 2",
      "title": "Nature Exploration",
      "activities": ["Visit Company Garden", "Explore Kempty Falls"]
    },
    {
      "day": "Day 3",
      "title": "Departure",
      "activities": [
        "Visit Gun Hill",
        "Shop at Kulri Bazaar",
        "Return to Dehradun"
      ]
    }
  ]
}
```

### Observation

This prompt consistently generated responses in the JSON structure expected by the application. Since the backend validates the JSON before returning it, the frontend can directly render attractive day-wise itinerary cards without additional formatting.

---

# Best Prompt

Prompt 3 produced the best results because it generated structured JSON that matched the application's expected response format. Compared to the earlier prompts, it returned more consistent and reliable outputs while still producing realistic travel recommendations. The structured response also simplified the backend validation process and allowed the frontend to dynamically display each day's itinerary as separate travel cards. Overall, this prompt provided the best balance between response quality, consistency, and ease of integration into the TravelTrail AI Travel Planner.
