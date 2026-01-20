import { t } from "elysia";

export const tagResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  name: t.String({ examples: ["Important"] }),
  color: t.Optional(t.Union([t.String({ examples: ["#8B5CF6"] }), t.Null()])),
  usageCount: t.Optional(t.Integer({ examples: [3] })),
});

export const subtaskResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  title: t.String({ examples: ["Draft outline"] }),
  completed: t.Boolean({ examples: [false] }),
  order: t.Integer({ examples: [0] }),
  createdAt: t.Date({ examples: ["2024-01-19T12:00:00.000Z"] }),
  updatedAt: t.Date({ examples: ["2024-01-19T12:00:00.000Z"] }),
});

export const todoResponse = t.Object({
  id: t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  title: t.String({ examples: ["Finish design"], minLength: 1 }),
  description: t.Union([t.String(), t.Null()]),
  completed: t.Boolean({ examples: [false] }),
  importance: t.Integer({ examples: [3] }),
  dueDate: t.Union([t.Date(), t.Null()]),
  tags: t.Array(tagResponse),
  subtasks: t.Array(subtaskResponse),
  createdAt: t.Date({ examples: ["2024-01-19T12:00:00.000Z"] }),
  updatedAt: t.Date({ examples: ["2024-01-19T12:00:00.000Z"] }),
});

export const todoListResponse = t.Object({
  items: t.Array(todoResponse),
  page: t.Integer({ examples: [1] }),
  pageSize: t.Integer({ examples: [20] }),
  total: t.Integer({ examples: [1] }),
  totalPages: t.Integer({ examples: [1] }),
});

export const tagsListResponse = t.Object({
  items: t.Array(tagResponse),
});

export const createTagBody = t.Object({
  name: t.String({ minLength: 1, maxLength: 32 }),
  color: t.Optional(
    t.Union([
      t.String({
        maxLength: 7,
        pattern: "^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$",
      }),
      t.Null(),
    ]),
  ),
});

export const updateTagBody = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 32 })),
  color: t.Optional(
    t.Union([
      t.String({
        maxLength: 7,
        pattern: "^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$",
      }),
      t.Null(),
    ]),
  ),
});

export const subtaskInput = t.Object({
  title: t.String({ minLength: 1, maxLength: 200 }),
  completed: t.Optional(t.Boolean()),
  order: t.Optional(t.Integer({ minimum: 0 })),
});

export const createTodoBody = t.Object({
  title: t.String({ minLength: 1, maxLength: 200 }),
  description: t.Optional(t.String({ maxLength: 5000 })),
  completed: t.Optional(t.Boolean()),
  importance: t.Optional(t.Integer({ minimum: 1, maximum: 5 })),
  dueDate: t.Optional(t.String({ examples: ["2024-01-19T12:00:00.000Z"] })),
  tags: t.Optional(
    t.Array(
      t.String({
        pattern:
          "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
      }),
    ),
  ),
  subtasks: t.Optional(t.Array(subtaskInput)),
});

export const updateTodoBody = t.Object({
  title: t.Optional(t.String({ minLength: 1, maxLength: 200 })),
  description: t.Optional(t.Union([t.String({ maxLength: 5000 }), t.Null()])),
  completed: t.Optional(t.Boolean()),
  importance: t.Optional(t.Integer({ minimum: 1, maximum: 5 })),
  dueDate: t.Optional(
    t.Union([t.String({ examples: ["2024-01-19T12:00:00.000Z"] }), t.Null()]),
  ),
  tags: t.Optional(
    t.Array(
      t.String({
        pattern:
          "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
      }),
    ),
  ),
  subtasks: t.Optional(t.Array(subtaskInput)),
});

export const listTodosQuery = t.Object({
  page: t.Optional(t.String({ examples: ["1"] })),
  pageSize: t.Optional(t.String({ examples: ["20"] })),
  search: t.Optional(t.String({ examples: ["design"] })),
  tag: t.Optional(t.String({ examples: ["Important"] })),
  tagId: t.Optional(
    t.String({ examples: ["550e8400-e29b-41d4-a716-446655440000"] }),
  ),
  dueFrom: t.Optional(t.String({ examples: ["2024-01-19T00:00:00.000Z"] })),
  dueTo: t.Optional(t.String({ examples: ["2024-01-31T23:59:59.000Z"] })),
  completed: t.Optional(t.String({ examples: ["false"] })),
  importanceMin: t.Optional(t.String({ examples: ["1"] })),
  importanceMax: t.Optional(t.String({ examples: ["5"] })),
  sort: t.Optional(
    t.Union([
      t.Literal("createdAt"),
      t.Literal("dueDate"),
      t.Literal("importance"),
    ]),
  ),
  order: t.Optional(t.Union([t.Literal("asc"), t.Literal("desc")])),
});

export const listTagsQuery = t.Object({
  search: t.Optional(t.String({ examples: ["Design"] })),
});

export const successResponse = t.Object({
  success: t.Boolean({ examples: [true] }),
  message: t.Optional(t.String()),
});

export const errorResponse = t.Object({
  message: t.String({ examples: ["An error occurred"] }),
  code: t.Optional(t.String({ examples: ["ERROR_CODE"] })),
});

export type CreateTodoBody = typeof createTodoBody.static;
export type UpdateTodoBody = typeof updateTodoBody.static;
export type ListTodosQuery = typeof listTodosQuery.static;
export type CreateTagBody = typeof createTagBody.static;
export type UpdateTagBody = typeof updateTagBody.static;
