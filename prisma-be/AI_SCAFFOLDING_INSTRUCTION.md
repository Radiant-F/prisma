You are a senior backend architect and TypeScript engineer.

Your task is to scaffold a production-ready backend project using the following stack and principles.
Follow ALL instructions carefully and do not skip steps or take shortcuts.

────────────────────────────────────
CORE STACK & RUNTIME
────────────────────────────────────

- Runtime: Bun
- Framework: ElysiaJS
- Language: TypeScript (strict)
- Database: PostgreSQL (already installed by the user)
- ORM: Drizzle ORM (type-safe, SQL-first)
- API Documentation: @elysiajs/openapi (DO NOT USE @elysiajs/swagger as it's no longer maintained)
- Authentication: JWT with hybrid model (access token + refresh token in HTTP-only cookie)
- Testing: bun:test
- Linting & Type Checking: ESLint + TypeScript
- Package manager: Bun ONLY (use `bun add` / `bun add -d`)

DO NOT manually edit package.json to add dependencies. This avoid outdated dependencies.
Always install dependencies via Bun commands.

────────────────────────────────────
PROJECT ASSUMPTIONS & BOUNDARIES
────────────────────────────────────

- The user has already:
  - Created a default ElysiaJS project using Bun
  - Installed PostgreSQL locally
  - Has access to `psql`
- The database itself ALREADY EXISTS
- The app must NEVER auto-create databases or users
- Database credentials must come from environment variables
- Use DATABASE_URL for DB connection

────────────────────────────────────
ENVIRONMENT CONFIGURATION
────────────────────────────────────

- Create a `.env.example` file
- Include:
  - DATABASE_URL
  - JWT_ACCESS_SECRET
  - JWT_REFRESH_SECRET
  - ACCESS_TOKEN_EXPIRES_IN
  - REFRESH_TOKEN_EXPIRES_IN
- Never commit real secrets
- The app must read from `.env`

────────────────────────────────────
FOLDER STRUCTURE (SCALABLE & CLEAN)
────────────────────────────────────
Design a scalable folder structure suitable for:

- growth
- feature isolation
- testability
- plugin-based architecture

At minimum include:

- src/
  - app.ts (or equivalent app entry)
  - server.ts (bootstrap / listen)
  - modules/
    - user/
      - user.routes.ts
      - user.service.ts
      - user.schema.ts
      - user.repository.ts
      - user.test.ts
  - auth/
    - auth.plugin.ts
    - jwt.ts
    - auth.guard.ts
  - db/
    - schema/
    - migrations/
    - seed.ts
    - index.ts
  - utils/
  - config/
- tests/ (if not colocated)
- docs/
- scripts/

────────────────────────────────────
DATABASE & MIGRATIONS
────────────────────────────────────

- Use Drizzle ORM
- Provide schema definitions for:
  - users table
    - id
    - username (unique)
    - password_hash
    - token_version (integer, default 0, for global invalidation)
    - created_at
    - updated_at
- Use migrations (Drizzle migration tooling)
- Provide a seed script (development only)

────────────────────────────────────
AUTHENTICATION MODEL (HYBRID)
────────────────────────────────────

- Access Token:
  - JWT
  - Short-lived
  - Sent via Authorization header (Bearer)
- Refresh Token:
  - JWT
  - Long-lived
  - Stored in HTTP-only cookie
- Implement:
  - signup
  - signin
    - Generate tokens containing current `token_version` from DB
  - token refresh
    - Verify token version matches DB version
  - logout
    - Increment user's `token_version` in DB to invalidate ALL existing tokens
- Authorization Strategy:

  - Verify JWT signature
  - Verify JWT `token_version` claim matches the user's current version in DB
  - If version mismatch -> 401 Unauthorized (Token Revoked)

- Only authenticated users may:
  - update their own profile
  - delete their own account

────────────────────────────────────
FEATURE: USER CRUD (STARTER)
────────────────────────────────────
Implement the following endpoints:

1. POST /auth/signup

   - body: username, password
   - hash password
   - create user

2. POST /auth/signin

   - body: username, password
   - return access token
   - set refresh token cookie

3. GET /users/me

   - authenticated
   - return current user profile

4. PUT /users/me

   - authenticated
   - update own profile only

5. DELETE /users/me
   - authenticated
   - delete own account only

────────────────────────────────────
API DOCUMENTATION REQUIREMENTS
────────────────────────────────────

- Use @elysiajs/openapi
- Use /docs as the route path to access the documentations
- Every route MUST include:
  - description
  - request body schema
  - response schema
  - example request body
  - example response body
- Security schemes must be defined in OpenAPI
- Authenticated routes must be marked as such

────────────────────────────────────
TESTING REQUIREMENTS
────────────────────────────────────

- Use bun:test
- Create unit tests AFTER implementing each feature
- Tests should:
  - call `app.handle(new Request(...))`
  - not require a running server
- Test ALL implemented features and endpoints, including:
  - signup success & failure (validation, duplicates)
  - signin success & failure (wrong creds)
  - protected route access control (unauthorized, invalid token, revoked token)
  - token refresh flow
  - user profile CRUD (get, update, delete)

────────────────────────────────────
LINTING & TYPE SAFETY
────────────────────────────────────

- Configure ESLint for TypeScript
- Run type checking after implementing each feature
- REQUIRED: Run a final `bun lint && bun typecheck` validation after ALL scaffolding is complete to ensure zero errors
- Code must be:
  - strict
  - typed
  - no implicit anys
- Prefer explicit return types for public functions
- Executing `bun lint && bun typecheck` should pass without erros and warnings

────────────────────────────────────
DOCUMENTATION OUTPUT
────────────────────────────────────

- Create a `SETUP.md` (or similar) containing:
  - one-time database setup instructions
  - environment setup
  - migration & seed commands
  - dev/test commands
- Clearly mark which steps are ONE-TIME ONLY
- Never imply the app auto-creates databases

────────────────────────────────────
QUALITY BAR
────────────────────────────────────

- No shortcuts
- No magic globals
- No insecure defaults
- Code should be readable, explicit, and teach good architecture
- Favor composition and plugins
- Be conservative with dependencies

If anything is missing or ambiguous:

- Make a reasonable architectural decision
- Explain it briefly in comments or documentation

Begin by installing required dependencies using Bun.
Then scaffold the project step by step.
