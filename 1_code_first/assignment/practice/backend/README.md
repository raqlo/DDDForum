# Backend

A backend application built with [Bun](https://bun.com), Hono, and PostgreSQL with Prisma ORM.

## Prerequisites

- [Bun](https://bun.com) v1.3.9 or later
- [Docker](https://www.docker.com/) and Docker Compose (for the PostgreSQL database)

## Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Edit the `.env` file and fill in your database credentials:

```
POSTGRES_PASSWORD=your_password
POSTGRES_USER=your_username
POSTGRES_DB=your_database_name
DATABASE_URL=postgresql://your_username:your_password@localhost:5433/your_database_name
```

### 3. Start the Database

Start the PostgreSQL database using Docker Compose:

```bash
bun run db:up
```

This will start a PostgreSQL container on port `5433`. We are using this port in case the default port `5432` is already in use by postgres insalled locally on your machine.

### 4. Run Database Migrations

Generate Prisma client and run migrations:

```bash
bun run db:generate
bun run db:migrate
```

### 5. Run the Application

For development with hot reload:

```bash
bun run dev
```

For production:

```bash
bun run start
```

## Available Scripts

- `bun run dev` - Start the development server with hot reload
- `bun run start` - Start the production server
- `bun run lint` - Run ESLint for code quality checks
- `bun run db:up` - Start the PostgreSQL database container
- `bun run db:migrate` - Run Prisma migrations
- `bun run db:push` - Push schema changes to the database
- `bun run db:generate` - Generate Prisma client

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript

## Project Structure

```
backend/
├── src/
│   └── index.ts        # Application entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── docker-compose.yml  # Docker configuration for PostgreSQL
├── .env.example        # Environment variables template
└── package.json        # Project dependencies and scripts
```