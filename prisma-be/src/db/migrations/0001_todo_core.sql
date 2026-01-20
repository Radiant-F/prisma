CREATE TABLE IF NOT EXISTS "todos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "description" text,
  "completed" boolean NOT NULL DEFAULT false,
  "importance" integer NOT NULL DEFAULT 3,
  "due_date" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "tags" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "color" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "tags_user_name_unique" ON "tags" ("user_id", "name");
CREATE INDEX IF NOT EXISTS "todos_user_idx" ON "todos" ("user_id");
CREATE INDEX IF NOT EXISTS "todos_due_idx" ON "todos" ("due_date");
CREATE INDEX IF NOT EXISTS "todos_search_idx" ON "todos" USING gin (to_tsvector('english', "title" || ' ' || coalesce("description", '')));

CREATE TABLE IF NOT EXISTS "todo_tags" (
  "todo_id" uuid NOT NULL REFERENCES "todos"("id") ON DELETE CASCADE,
  "tag_id" uuid NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("todo_id", "tag_id")
);

CREATE TABLE IF NOT EXISTS "subtasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "todo_id" uuid NOT NULL REFERENCES "todos"("id") ON DELETE CASCADE,
  "title" text NOT NULL,
  "completed" boolean NOT NULL DEFAULT false,
  "order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "subtasks_todo_idx" ON "subtasks" ("todo_id");
CREATE INDEX IF NOT EXISTS "todo_tags_tag_idx" ON "todo_tags" ("tag_id");
