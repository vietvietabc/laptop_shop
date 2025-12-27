# Laptop Shop

Project repository for a simple laptop shop application (backend FastAPI + frontend React/Vite).

## Overview
- Backend: FastAPI app in `backend/`.
- Frontend: React + Vite in `frontend/`.

## Requirements
- Python 3.10+
- Node 16+
- Git

## Backend — Setup & Run (Windows, PowerShell)
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1    # PowerShell
pip install -r requirements.txt
# The backend creates tables on startup (Base.metadata.create_all).
uvicorn app.main:app
```
Open API docs: http://127.0.0.1:8000/docs

If you use environment variables, create a `.env` in `backend/` and ensure it's in `.gitignore`.
DATABASE_URL=mysql+pymysql://root:passmysqlcuaban@localhost:3306/laptopshop_api
SECRET_KEY=passmysqlcuaban
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads

## Frontend — Setup & Run
```bash
cd frontend
npm install
npm run dev
```
Dev server usually runs at http://localhost:5173 (Vite).

## Database / Migrations
This project includes Alembic configuration in `backend/alembic/` if you prefer migrations. Current code also calls `Base.metadata.create_all`.

Create database laptopshop_api
bash: python create_migration "Abc"
bash: python apply_migration.py
insert 1 admin 2 user vào role
## Git
A root `.gitignore` is recommended to exclude virtual environments, `node_modules`, `__pycache__`, uploads, and IDE files.

## Useful commands
- Stage & commit:
```bash
git add .
git commit -m "Describe changes"
```
- Push:
```bash
git push -u origin HEAD
```

## Next steps
- Add `.env` with secrets (do not commit).
- Run migrations if you switch from `create_all` to Alembic.

