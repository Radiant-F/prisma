# Project Setup

## Prerequisites

- Bun >= 1.0
- PostgreSQL >= 14

## One-Time Database Setup

> ⚠️ The application does NOT auto-create databases or users.

```bash
# Create database (run once)
createdb myapp_dev

# Or via psql
psql -c "CREATE DATABASE myapp_dev;"
```

## Environment Setup

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
nano .env
```

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens (generate with: `openssl rand -base64 32`)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (generate with: `openssl rand -base64 32`)

## Install Dependencies

```bash
bun install
```

## Database Migrations

```bash
# Generate migrations from schema changes
bun run db:generate

# Apply migrations
bun run db:migrate

# (Optional) Open Drizzle Studio
bun run db:studio

# (Optional) Seed development data
bun run db:seed
```

## Development

```bash
bun run dev
```

- API available at: http://localhost:3000
- OpenAPI docs at: http://localhost:3000/docs
- Health check at: http://localhost:3000/health

## Testing

```bash
# Run all tests
bun test

# Watch mode
bun test:watch
```

## Linting & Type Checking

```bash
# Run ESLint
bun run lint

# Run TypeScript type checking
bun run typecheck

# Run all validations (lint + typecheck + test)
bun run validate
```

## Production Build

```bash
bun run build
bun run start
```

## API Endpoints

### Authentication

| Method | Path            | Auth     | Description           |
| ------ | --------------- | -------- | --------------------- |
| POST   | `/auth/signup`  | Public   | Register new user     |
| POST   | `/auth/signin`  | Public   | Login, issue tokens   |
| POST   | `/auth/refresh` | Cookie   | Refresh access token  |
| POST   | `/auth/logout`  | Required | Invalidate all tokens |

### Users

| Method | Path        | Auth     | Description                 |
| ------ | ----------- | -------- | --------------------------- |
| GET    | `/users/me` | Required | Get current user profile    |
| PUT    | `/users/me` | Required | Update current user profile |
| DELETE | `/users/me` | Required | Delete current user account |

## Project Structure

```
src/
├── index.ts              # App composition & export type
├── server.ts             # Bootstrap / listen
├── app.ts                # Main Elysia app
│
├── modules/
│   ├── auth/             # Authentication module
│   │   ├── auth.routes.ts
│   │   ├── auth.service.ts
│   │   ├── auth.schema.ts
│   │   ├── auth.guard.ts
│   │   └── jwt.plugin.ts
│   │
│   └── user/             # User module
│       ├── user.routes.ts
│       ├── user.schema.ts
│       └── user.repository.ts
│
├── db/
│   ├── index.ts          # Drizzle client instance
│   ├── schema/           # Drizzle schemas
│   ├── migrations/       # Drizzle migrations
│   └── seed.ts           # Development seed script
│
├── lib/
│   ├── env.ts            # Environment config with validation
│   └── errors.ts         # Custom error classes
│
├── plugins/
│   └── error-handler.ts  # Global error handler plugin
│
└── tests/                # Integration tests
```
