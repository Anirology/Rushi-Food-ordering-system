# Rushi — Jaffna Vegetarian Kitchen

Rushi serves traditional vegetarian dishes from Jaffna and South India, prepared with care and shared with warmth.

This repository contains a React ordering experience and a FastAPI REST API backed by MySQL, SQLAlchemy, and Pydantic.

## Project layout

```text
assets/       Brand and dish photography
backend/      FastAPI application and backend dependencies
database/     MySQL schema, migrations, and seed data
docs/         Product, brand, API, and database documentation
frontend/     React customer and admin application
scripts/      Local development and maintenance helpers
```

## Technology

- Python, FastAPI, Pydantic, SQLAlchemy, Alembic
- MySQL 8+
- React, Vite, JavaScript, Axios
- pytest, Ruff, ESLint

## Getting started

1. Create a MySQL database and a least-privilege application user (see `docs/database/setup.md`).
2. Copy `.env.example` to `.env` and set a private database password.
3. Follow `backend/README.md` to install and run the API.
4. Follow `frontend/README.md` to install and run the website.

The API is versioned under `/api/v1`; its interactive documentation is available at `/docs` while running locally.

## Brand direction

Use warm ivory, deep aubergine, saffron gold, muted rose, and warm charcoal. Cormorant Garamond is reserved for expressive display type; DM Sans is used for practical interface text. Food photography should remain natural and prominent, and page layouts should retain generous breathing room at every screen size.
