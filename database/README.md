# Database Directory

This folder contains the Smart Cost application database artifacts.

## Structure

- `schema/` - SQL table definitions for the core data model.
- `seed/` - Seed data scripts for categories, admin user, and example records.
- `migrations/` - Migration scripts for incremental schema setup.
- `backups/` - Backup folders for daily, weekly, and monthly database snapshots.
- `diagrams/` - ERD and database design documentation.
- `scripts/` - Utility SQL scripts for resetting, indexing, truncating, and cleaning data.
- `docker/` - PostgreSQL initialization and configuration files.

## How to use

1. Create the database in PostgreSQL.
2. Run the schema scripts in `schema/` or use `docker/init.sql` inside a Dockerized Postgres setup.
3. Run seed scripts from `seed/` to populate initial data.
4. Use `scripts/` to manage test data and reset the database as needed.
