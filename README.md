# Study Platform

A full-stack study assistant platform with a FastAPI backend and a React (Vite) frontend.

## Project Structure

- `backend/`: FastAPI application, routers, models, schemas, and seed scripts
- `frontend/`: React application built with Vite

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Backend Setup (FastAPI)

1. Open a terminal in the project root.
2. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install backend dependencies:

```powershell
pip install -r backend/requirements.txt
```

4. Start the backend server:

```powershell
cd backend
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

## Frontend Setup (React + Vite)

1. Open a second terminal in the project root.
2. Install frontend dependencies:

```powershell
cd frontend
npm install
```

3. Start the frontend dev server:

```powershell
npm run dev
```

Frontend usually runs at: `http://127.0.0.1:5173`

## Development Notes

- Keep backend and frontend running in separate terminals during development.
- If CORS issues appear, verify backend CORS settings in `backend/main.py`.
- API client settings are in `frontend/src/api/axios.js`.

## Useful Commands

From project root:

```powershell
# Start backend
cd backend
uvicorn main:app --reload

# Start frontend
cd frontend
npm run dev
```

## License

No license file is currently defined for this repository.
