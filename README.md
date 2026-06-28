# TravelTrail: AI-Assisted Homestay & Travel Planner

An AI-assisted homestay booking and travel planning platform designed to help travelers explore homestay information, check room availability, submit booking requests, and plan their trips with AI assistance.

---

## Tech Stack

**Frontend**

- React.js
- Tailwind CSS
- Axios / Fetch API

**Backend**

- FastAPI (Python)
- Uvicorn
- Python-dotenv
- CORS Middleware

**Database**

- MongoDB (planned for Week 5 — currently using in-memory data)

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

Backend will be running at: `http://localhost:8000`

---

## Frontend Setup (Run Locally)

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---
