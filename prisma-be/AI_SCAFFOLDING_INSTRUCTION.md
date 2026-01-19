# ElysiaJS Backend Scaffolding Instruction

You are a senior backend architect and TypeScript engineer.

Your task is to scaffold a production-ready backend project using the following stack and principles.
Follow ALL instructions carefully and do not skip steps or take shortcuts.

---

## CORE STACK & RUNTIME

| Layer           | Technology                                         |
| --------------- | -------------------------------------------------- |
| Runtime         | Bun                                                |
| Framework       | ElysiaJS                                           |
| Language        | TypeScript (strict mode)                           |
| Database        | PostgreSQL (already installed)                     |
| ORM             | Drizzle ORM (SQL-first, type-safe)                 |
| API Docs        | `@elysiajs/openapi` (OpenAPI 3.1 / Scalar UI)      |
| Client/Testing  | `@elysiajs/eden` (Eden Treaty)                     |
| Authentication  | `@elysiajs/jwt` (access + refresh token in cookie) |
| Testing         | `bun: test`                                        |
| Linting         | ESLint + TypeScript                                |
| Package Manager | Bun ONLY (`bun add` / `bun add -d`)                |

---

## KEY ELYSIAJS CONCEPTS

Before scaffolding, understand these core ElysiaJS principles:

### Handler & Context

Handlers receive a `Context` object containing request data and utilities:

```typescript
app.get("/user/:id", ({ params, query, headers, cookie, store }) => {
  return { id: params.id };
});
```

### Lifecycle Hooks

ElysiaJS provides lifecycle hooks for request processing:

- `onRequest` → `onParse` → `onTransform` → `onBeforeHandle` → **Handler** → `onAfterHandle` → `onMapResponse` → `onAfterResponse`
- Use `onError` for centralized error handling.

### Plugin Architecture

Use instance-based or functional plugins for modularity and code reuse:

```typescript
// Instance plugin (recommended for feature modules)
const userPlugin = new Elysia({ prefix: "/users" })
  .get("/", () => "list users")
  .get("/:id", ({ params }) => `user ${params.id}`);

// Functional plugin (for cross-cutting concerns)
const authPlugin = (app: Elysia) =>
  app.derive(({ headers }) => ({
    user: verifyToken(headers.authorization),
  }));
```

### Scoping & Encapsulation

- Plugins are **scoped** by default (local state doesn't leak to parent).
- Use `.scoped()` or `.as('plugin')` to control what propagates.
- Use `.guard()` to apply shared validation/hooks to grouped routes.

### Validation with TypeBox (Elysia. t)

Use `t` for schema-based validation with automatic type inference:

```typescript
import { Elysia, t } from "elysia";

app.post("/user", ({ body }) => body, {
  body: t.Object({
    username: t.String({ minLength: 3 }),
    email: t.String({ format: "email" }),
  }),
  response: {
    200: t.Object({ id: t.String(), username: t.String() }),
    400: t.Object({ message: t.String() }),
  },
});
```

---

## REFERENCES & CONTEXT

Refer to these official ElysiaJS resources:

### Getting Started

- [At Glance](https://elysiajs.com/at-glance)
- [Quick Start](https://elysiajs.com/quick-start)
- [Key Concept](https://elysiajs.com/key-concept)

### Essential

- [Route](https://elysiajs.com/essential/route) – Path patterns, methods, wildcards
- [Handler](https://elysiajs.com/essential/handler) – Context object, returning responses
- [Plugin](https://elysiajs.com/essential/plugin) – Modularity and composition
- [Lifecycle](https://elysiajs.com/essential/life-cycle) – Request lifecycle hooks
- [Validation](https://elysiajs.com/essential/validation) – Schema validation with TypeBox
- [Best Practice](https://elysiajs.com/essential/best-practice) – Architecture patterns

### Patterns

- [Configuration](https://elysiajs.com/patterns/configuration) – App configuration
- [Cookie](https://elysiajs.com/patterns/cookie) – Reactive cookie handling
- [Error Handling](https://elysiajs. com/patterns/error-handling) – Centralized error handling
- [Extends Context](https://elysiajs.com/patterns/extends-context) – State, derive, decorate
- [Macro](https://elysiajs.com/patterns/macro) – Custom route property macros
- [OpenAPI](https://elysiajs.com/patterns/openapi) – API documentation patterns
- [Testing](https://elysiajs.com/patterns/unit-test) – Unit testing patterns
- [TypeBox](https://elysiajs.com/patterns/typebox) – Advanced schema patterns
- [TypeScript](https://elysiajs.com/patterns/typescript) – Type inference and safety

### Eden (End-to-End Type Safety)

- [Overview](https://elysiajs.com/eden/overview) – Eden introduction
- [Treaty Overview](https://elysiajs.com/eden/treaty/overview) – Treaty client
- [Parameters](https://elysiajs.com/eden/treaty/parameters) – Path/query params
- [Response](https://elysiajs.com/eden/treaty/response) – Response handling
- [Unit Test](https://elysiajs.com/eden/treaty/unit-test) – Testing with Treaty
- [Config](https://elysiajs.com/eden/treaty/config) – Treaty configuration

### Plugins

- [JWT Plugin](https://elysiajs.com/plugins/jwt) – JWT authentication
- [Bearer Plugin](https://elysiajs.com/plugins/bearer) – Bearer token extraction
- [OpenAPI Plugin](https://elysiajs. com/plugins/openapi) – API documentation
- [CORS Plugin](https://elysiajs. com/plugins/cors) – CORS configuration

### Integrations

- [Drizzle Integration](https://elysiajs.com/integrations/drizzle) – Drizzle ORM setup

---

## IMPORTANT RULES

1. **DO NOT manually edit `package.json`** to add dependencies. Always use `bun add` commands.
2. **Use `t.*` (TypeBox)** for all validation schemas—not Zod or other libraries.
3. **Export app type** for Eden Treaty type inference: `export type App = typeof app`
4. **Prefer composition over inheritance** – use plugins and `.use()` extensively.
5. **Keep handlers thin** – delegate business logic to service layer.

---

## PROJECT ASSUMPTIONS & BOUNDARIES

The user has already:

- Created a default ElysiaJS project using `bun create elysia`
- Installed PostgreSQL locally
- Has access to `psql`

The app must:

- **NEVER** auto-create databases or users
- Read database credentials from environment variables
- Use `DATABASE_URL` for database connection

---

## ENVIRONMENT CONFIGURATION

Create a `.env.example` file with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost: 5432/mydb

# JWT Secrets (generate with:  openssl rand -base64 32)
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Token Expiration
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

- Never commit real secrets.
- The app reads from `.env` using Bun's built-in env support.

---

## FOLDER STRUCTURE

Design a scalable, feature-isolated structure:

```
project-root/
├── src/
│   ├── index.ts              # App composition & export type
│   ├── server.ts             # Bootstrap / listen
│   │
│   ├── modules/
│   │   ├── user/
│   │   │   ├── user.routes.ts      # Elysia plugin with routes
│   │   │   ├── user.service.ts     # Business logic
│   │   │   ├── user.schema.ts      # TypeBox schemas (request/response)
│   │   │   ├── user.repository.ts  # Database operations
│   │   │   └── user.test.ts        # Unit tests
│   │   │
│   │   └── auth/
│   │       ├── auth.routes. ts
│   │       ├── auth.service.ts
│   │       ├── auth.schema.ts
│   │       ├── auth.guard.ts       # beforeHandle guard
│   │       ├── jwt.plugin.ts       # JWT plugin configuration
│   │       └── auth.test.ts
│   │
│   ├── db/
│   │   ├── index.ts          # Drizzle client instance
│   │   ├── schema/
│   │   │   ├── index.ts      # Export all schemas
│   │   │   └── users.ts      # User table schema
│   │   ├── migrations/       # Drizzle migrations
│   │   └── seed.ts           # Development seed script
│   │
│   ├── lib/
│   │   ├── env.ts            # Environment config with validation
│   │   └── errors.ts         # Custom error classes
│   │
│   └── plugins/
│       └── error-handler.ts  # Global error handler plugin
│
├── tests/                    # Integration tests (if not colocated)
├── docs/                     # Additional documentation
├── scripts/                  # Utility scripts
├── drizzle. config.ts         # Drizzle configuration
├── . env.example
├── .env                      # Local (gitignored)
├── tsconfig.json
├── eslint.config.js
└── package.json
```

### Structure Principles

1. **Feature-based modules** – Each module is self-contained with routes, services, schemas.
2. **Routes as plugins** – Export Elysia instances from route files.
3. **Colocated tests** – Tests live next to the code they test.
4. **Shared plugins** – Cross-cutting concerns in `/plugins`.
5. **Database layer** – Drizzle schema, migrations, and client isolated in `/db`.

---

## DATABASE & MIGRATIONS (DRIZZLE ORM)

### Schema Definition

Define the users table in `src/db/schema/users.ts`:

```typescript
import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  tokenVersion: integer("token_version").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### Migration Commands

Configure `drizzle. config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Add npm scripts:

```json
{
  "scripts": {
    "db: generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db: seed": "bun run src/db/seed. ts"
  }
}
```

### Seed Script

Create `src/db/seed.ts` for development:

```typescript
import { db } from "./index";
import { users } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");
  // Add seed data here
  console.log("✅ Seeding complete");
}

seed().catch(console.error);
```

---

## AUTHENTICATION MODEL (HYBRID JWT)

### Token Strategy

| Token         | Lifetime | Storage                 | Purpose            |
| ------------- | -------- | ----------------------- | ------------------ |
| Access Token  | 15 min   | Authorization header    | API authentication |
| Refresh Token | 7 days   | HTTP-only secure cookie | Token renewal      |

### Token Version for Global Invalidation

- Store `token_version` in the users table.
- Include `tokenVersion` claim in JWT payload.
- On verification, compare JWT claim with DB value.
- On logout, increment `token_version` to invalidate all existing tokens.

### JWT Plugin Configuration

```typescript
// src/modules/auth/jwt.plugin.ts
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "../../lib/env";

export const jwtPlugin = new Elysia({ name: "jwt" })
  .use(
    jwt({
      name: "accessJwt",
      secret: env.JWT_ACCESS_SECRET,
      exp: env.ACCESS_TOKEN_EXPIRES_IN,
    }),
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: env.JWT_REFRESH_SECRET,
      exp: env.REFRESH_TOKEN_EXPIRES_IN,
    }),
  );
```

### Auth Guard (beforeHandle)

```typescript
// src/modules/auth/auth.guard.ts
import { Elysia } from "elysia";
import { jwtPlugin } from "./jwt.plugin";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const authGuard = new Elysia({ name: "authGuard" })
  .use(jwtPlugin)
  .derive(async ({ accessJwt, headers, error }) => {
    const authorization = headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      throw error(401, { message: "Missing authorization header" });
    }

    const token = authorization.slice(7);
    const payload = await accessJwt.verify(token);

    if (!payload) {
      throw error(401, { message: "Invalid or expired token" });
    }

    // Verify token version matches DB
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub as string))
      .limit(1);

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw error(401, { message: "Token revoked" });
    }

    return { user };
  });
```

---

## FEATURE: AUTH & USER CRUD

### Endpoints

| Method | Path            | Auth     | Description                 |
| ------ | --------------- | -------- | --------------------------- |
| POST   | `/auth/signup`  | Public   | Register new user           |
| POST   | `/auth/signin`  | Public   | Login, issue tokens         |
| POST   | `/auth/refresh` | Cookie   | Refresh access token        |
| POST   | `/auth/logout`  | Required | Invalidate all tokens       |
| GET    | `/users/me`     | Required | Get current user profile    |
| PUT    | `/users/me`     | Required | Update current user profile |
| DELETE | `/users/me`     | Required | Delete current user account |

### Schema Definitions

```typescript
// src/modules/auth/auth.schema.ts
import { t } from "elysia";

export const signupBody = t.Object({
  username: t.String({ minLength: 3, maxLength: 32 }),
  password: t.String({ minLength: 8, maxLength: 128 }),
});

export const signinBody = t.Object({
  username: t.String(),
  password: t.String(),
});

export const authResponse = t.Object({
  accessToken: t.String(),
  user: t.Object({
    id: t.String(),
    username: t.String(),
  }),
});

export const errorResponse = t.Object({
  message: t.String(),
});
```

### Route Implementation Pattern

```typescript
// src/modules/auth/auth.routes.ts
import { Elysia } from "elysia";
import {
  signupBody,
  signinBody,
  authResponse,
  errorResponse,
} from "./auth.schema";
import { authService } from "./auth. service";
import { jwtPlugin } from "./jwt.plugin";

export const authRoutes = new Elysia({ prefix: "/auth" }).use(jwtPlugin).post(
  "/signup",
  async ({ body, accessJwt, refreshJwt, cookie }) => {
    const result = await authService.signup(body);
    const accessToken = await accessJwt.sign({
      sub: result.user.id,
      tokenVersion: result.user.tokenVersion,
    });
    const refreshToken = await refreshJwt.sign({
      sub: result.user.id,
      tokenVersion: result.user.tokenVersion,
    });

    cookie.refreshToken.set({
      value: refreshToken,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return { accessToken, user: result.user };
  },
  {
    body: signupBody,
    response: {
      200: authResponse,
      400: errorResponse,
      409: errorResponse,
    },
    detail: {
      summary: "Register a new user",
      description: "Creates a new user account and returns access token",
      tags: ["Auth"],
    },
  },
);
// ... other routes
```

---

## API DOCUMENTATION (OpenAPI)

### Setup

```typescript
import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia().use(
  openapi({
    path: "/docs",
    documentation: {
      info: {
        title: "My API",
        version: "1.0.0",
        description: "Production-ready ElysiaJS API",
      },
      tags: [
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Users", description: "User management endpoints" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  }),
);
```

### Route Documentation Requirements

Every route MUST include:

- `detail. summary` – Short description
- `detail.description` – Detailed explanation
- `detail.tags` – Category grouping
- `body` schema with examples
- `response` schemas for all status codes

```typescript
. post('/example', handler, {
  body:  t.Object({
    name: t.String({ examples: ['John Doe'] })
  }),
  response: {
    200: t.Object({
      id:  t.String({ examples: ['550e8400-e29b-41d4-a716-446655440000'] }),
      name: t.String({ examples: ['John Doe'] })
    }),
    400: errorResponse
  },
  detail: {
    summary: 'Create example',
    description:  'Creates a new example resource',
    tags:  ['Examples'],
    security: [{ bearerAuth: [] }]
  }
})
```

---

## TESTING WITH EDEN TREATY

### Testing Pattern (No Network Overhead)

Use Eden Treaty with direct instance passing for unit tests:

```typescript
// src/modules/user/user.test.ts
import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import { app } from "../../index";

const api = treaty(app);

describe("User Module", () => {
  describe("GET /users/me", () => {
    it("should return 401 without auth token", async () => {
      const { error } = await api.users.me.get();

      expect(error).not.toBeNull();
      expect(error?.status).toBe(401);
    });

    it("should return user profile with valid token", async () => {
      const { data, error } = await api.users.me.get({
        headers: {
          authorization: `Bearer ${validToken}`,
        },
      });

      expect(error).toBeNull();
      expect(data).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
      });
    });
  });
});
```

### Response Handling Pattern

Eden Treaty returns `{ data, error, response, status, headers }`:

```typescript
const { data, error } = await api.auth.signup.post({
  username: "testuser",
  password: "password123",
});

if (error) {
  // error is narrowed based on response schema
  switch (error.status) {
    case 400:
      console.log("Validation error:", error.value.message);
      break;
    case 409:
      console.log("User exists:", error.value.message);
      break;
  }
} else {
  // data is fully typed
  console.log("User created:", data.user.id);
}
```

### Test Coverage Requirements

Test ALL endpoints including:

| Test Case                          | Expected Outcome          |
| ---------------------------------- | ------------------------- |
| Signup with valid data             | 200, returns tokens       |
| Signup with duplicate username     | 409, conflict error       |
| Signup with invalid data           | 400, validation error     |
| Signin with valid credentials      | 200, returns tokens       |
| Signin with wrong password         | 401, unauthorized         |
| Signin with non-existent user      | 401, unauthorized         |
| Protected route without token      | 401, missing auth         |
| Protected route with invalid token | 401, invalid token        |
| Protected route with revoked token | 401, token revoked        |
| Token refresh with valid cookie    | 200, new access token     |
| Token refresh with invalid cookie  | 401, unauthorized         |
| Get profile with valid token       | 200, returns user         |
| Update profile with valid token    | 200, returns updated user |
| Delete account with valid token    | 200, account deleted      |

### Type Safety Check

Run TypeScript checks on test files:

```bash
tsc --noEmit src/**/*.test.ts
```

---

## LINTING & TYPE SAFETY

### ESLint Configuration

```javascript
// eslint. config.js
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },
);
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "declaration": true
  },
  "include": ["src/**/*.ts"]
}
```

### NPM Scripts

```json
{
  "scripts": {
    "dev": "bun run --watch src/server.ts",
    "build": "bun build src/server.ts --outdir ./dist",
    "start": "bun run dist/server.js",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "test": "bun test",
    "test: watch": "bun test --watch",
    "validate": "bun run lint && bun run typecheck && bun test"
  }
}
```

### Final Validation

After scaffolding, run:

```bash
bun run validate
```

This must pass with **zero errors and warnings**.

---

## DOCUMENTATION OUTPUT

Create a `SETUP.md` containing:

````markdown
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
cp . env.example .env

# Edit with your values
nano .env
```

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

# (Optional) Seed development data
bun run db:seed
```

## Development

```bash
bun run dev
```

API available at: http://localhost:3000
OpenAPI docs at: http://localhost:3000/docs

## Testing

```bash
# Run all tests
bun test

# Watch mode
bun test --watch
```

## Production Build

```bash
bun run build
bun run start
```
````
