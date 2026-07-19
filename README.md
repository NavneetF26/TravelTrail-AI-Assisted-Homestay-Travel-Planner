# TravelTrail: AI-Assisted Homestay & Travel Planner

An AI-assisted homestay booking and travel planning platform that enables travelers to discover homestays, manage bookings, save favorites, and generate personalized travel itineraries using Google's Gemini AI.

---

## Features

- Browse available homestays
- View detailed homestay information
- Search homestays by name, location, and budget
- View available rooms and amenities
- Create, update, view, and delete bookings
- Save and manage favorite homestays
- User Authentication (Register/Login & Google Sign-In)
- AI-powered Travel Planner using Google Gemini
- Personalized day-wise travel itineraries
- Budget-aware travel recommendations

---

## Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios / Fetch API

### Backend

- FastAPI (Python)
- Uvicorn
- Google Gemini API
- Python-dotenv
- CORS Middleware

### Database

- MongoDB Atlas
- PyMongo

---

## AI Integration

TravelTrail integrates Google's Gemini API to generate personalized travel itineraries.

The AI Travel Planner allows users to:

- Enter a destination
- Specify their budget
- Choose trip duration
- Select travel interests
- Add optional travel preferences

The backend securely communicates with the Google Gemini API using an API key stored in environment variables. The AI-generated response is validated before being returned to the frontend, where it is displayed as a personalized day-wise travel itinerary.

---

## Frontend Setup (Run Locally)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at:

`http://localhost:5173`

---

## Backend Setup (Run Locally)

**Step 1 — Create a virtual environment**

```bash
python -m venv venv
```

**Step 2 — Activate the environment**

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

**Step 3 — Install dependencies**

```bash
pip install -r requirements.txt
```

**Step 4 — Set up environment variables**

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

**Step 5 — Run the backend server**

```bash
uvicorn app.main:app --reload
```

Backend will be running at:

`http://localhost:8000`

---

## Database

TravelTrail uses **MongoDB Atlas** as its primary database.

MongoDB was chosen because it stores data as flexible JSON-like documents, making it ideal for the project's nested structure where each homestay contains rooms, amenities, images, and nearby attractions inside a single document.

The application currently uses the following collections:

- **users**
- **homestays**
- **bookings**
- **saved_homestays**

---

## Database Schema

![Database Schema](docs/schema.png)

---

## Database Setup

## 1. Create a MongoDB Atlas Cluster

Create a free MongoDB Atlas cluster and obtain your connection string.

---

## 2. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/?retryWrites=true&w=majority&appName=<app-name>

# JWT Authentication
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session
SESSION_SECRET=your_session_secret

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

A sample configuration is also provided in `.env.example`.

---

## 3. Seed the Database

Run the seed script once from the backend folder to import the initial homestay data.

```bash
python scripts/seed.py
```

---

## Database Collections

The project currently contains the following MongoDB collections:

- **users** – Stores user profile information and authentication details.
- **homestays** – Stores homestay details, rooms, amenities, images, and nearby attractions.
- **bookings** – Stores booking details, guest information, travel dates, and booking status.
- **saved_homestays** – Stores users' saved or favorite homestays for quick access.

---
