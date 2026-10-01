# MySQL setup

Use MySQL 8 or later with `utf8mb4`. Create a dedicated database and application account; do not use the MySQL root account from the application.

```sql
CREATE DATABASE food_ordering_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE USER 'rushi_app'@'localhost' IDENTIFIED BY 'replace-with-a-private-password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON food_ordering_db.* TO 'rushi_app'@'localhost';
```

Put the resulting connection string in a local `.env` file using `.env.example` as a template. Never commit real credentials. Apply schema changes with Alembic after installing backend dependencies.

The initial schema is in `database/schema.sql`; the first Alembic revision is the source of truth for application upgrades.
