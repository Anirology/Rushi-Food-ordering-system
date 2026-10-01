# Backend

FastAPI service for the Rushi food ordering system. The API is versioned under `/api/v1` and uses Pydantic for request/response validation, SQLAlchemy 2 for persistence, Alembic for schema upgrades, and MySQL in production.

## Local setup

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item ..\.env.example ..\.env
uvicorn app.main:app --reload
```

Create the MySQL database and configure `DATABASE_URL` before enabling database-backed endpoints. `GET /health` and `GET /api/v1/health` are database independent. Interactive API docs are at `/docs`.
