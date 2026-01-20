import { Elysia } from "elysia";
import { authGuard } from "../auth/auth.guard";
import { todoRepository } from "./todo.repository";
import {
  createTagBody,
  createTodoBody,
  errorResponse,
  listTagsQuery,
  listTodosQuery,
  successResponse,
  tagResponse,
  tagsListResponse,
  todoListResponse,
  todoResponse,
  updateTagBody,
  updateTodoBody,
} from "./todo.schema";
import { ValidationError } from "../../lib/errors";

const mapTags = (
  items: Array<{
    id: string;
    name: string;
    color: string | null;
    usageCount?: number | string;
  }>,
) =>
  items.map((tag) => ({
    id: tag.id,
    name: tag.name,
    color: tag.color ?? null,
    ...(tag.usageCount !== undefined
      ? { usageCount: Number(tag.usageCount) }
      : {}),
  }));

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parseBoolean = (value?: string) => {
  if (value === undefined) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

export const todoRoutes = new Elysia({ prefix: "/todos" })
  .use(authGuard)
  .get(
    "/",
    async ({ query, user }) => {
      const page = Math.max(1, parseNumber(query.page, 1));
      const pageSize = Math.min(
        100,
        Math.max(1, parseNumber(query.pageSize, 20)),
      );
      const sort = query.sort ?? "createdAt";
      const order = query.order ?? "desc";

      const result = await todoRepository.list(user.id, {
        page,
        pageSize,
        search: query.search,
        tag: query.tag,
        tagId: query.tagId,
        dueFrom: parseDate(query.dueFrom),
        dueTo: parseDate(query.dueTo),
        completed: parseBoolean(query.completed),
        importanceMin: query.importanceMin
          ? parseNumber(query.importanceMin, 1)
          : undefined,
        importanceMax: query.importanceMax
          ? parseNumber(query.importanceMax, 5)
          : undefined,
        sort: sort === "dueDate" || sort === "importance" ? sort : "createdAt",
        order: order === "asc" ? "asc" : "desc",
      });

      const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

      return {
        items: result.items.map((item) => ({
          ...item.todo,
          tags: mapTags(item.tags),
          subtasks: item.subtasks,
        })),
        page,
        pageSize,
        total: result.total,
        totalPages,
      };
    },
    {
      isAuth: true,
      query: listTodosQuery,
      response: {
        200: todoListResponse,
        400: errorResponse,
        401: errorResponse,
      },
      detail: {
        summary: "List todos",
        description:
          "Returns a paginated list of todos with optional filters for search, tags, and due dates.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .post(
    "/",
    async ({ body, user }) => {
      const dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
      if (body.dueDate && Number.isNaN(dueDate?.getTime())) {
        throw new ValidationError("Invalid due date");
      }

      const result = await todoRepository.create(user.id, {
        title: body.title,
        description: body.description ?? null,
        completed: body.completed ?? false,
        importance: body.importance,
        dueDate: dueDate ?? null,
        tags: body.tags,
        subtasks: body.subtasks,
      });

      return {
        ...result.todo,
        tags: mapTags(result.tags),
        subtasks: result.subtasks,
      };
    },
    {
      isAuth: true,
      body: createTodoBody,
      response: {
        200: todoResponse,
        400: errorResponse,
        401: errorResponse,
      },
      detail: {
        summary: "Create todo",
        description:
          "Creates a todo with optional tags, subtasks, and due date.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .get(
    "/tags",
    async ({ query, user }) => {
      const items = await todoRepository.listTags(user.id, query.search);
      return { items: mapTags(items) };
    },
    {
      isAuth: true,
      query: listTagsQuery,
      response: {
        200: tagsListResponse,
        401: errorResponse,
      },
      detail: {
        summary: "List tags",
        description: "Returns tags for the current user with optional search.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .post(
    "/tags",
    async ({ body, user }) => {
      const tag = await todoRepository.createTag(user.id, {
        name: body.name,
        color: body.color ?? null,
      });

      const usageCount = await todoRepository.getTagUsageCount(tag.id);

      return {
        id: tag.id,
        name: tag.name,
        color: tag.color ?? null,
        usageCount,
      };
    },
    {
      isAuth: true,
      body: createTagBody,
      response: {
        200: tagResponse,
        400: errorResponse,
        401: errorResponse,
        409: errorResponse,
      },
      detail: {
        summary: "Create tag",
        description: "Creates a tag for the current user.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .get(
    "/tags/:id",
    async ({ params, user }) => {
      const tag = await todoRepository.getTagById(user.id, params.id);
      const usageCount = await todoRepository.getTagUsageCount(tag.id);
      return {
        id: tag.id,
        name: tag.name,
        color: tag.color ?? null,
        usageCount,
      };
    },
    {
      isAuth: true,
      response: {
        200: tagResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Get tag",
        description: "Returns a single tag owned by the current user.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .put(
    "/tags/:id",
    async ({ params, body, user }) => {
      const tag = await todoRepository.updateTag(user.id, params.id, {
        name: body.name,
        color: body.color,
      });

      const usageCount = await todoRepository.getTagUsageCount(tag.id);

      return {
        id: tag.id,
        name: tag.name,
        color: tag.color ?? null,
        usageCount,
      };
    },
    {
      isAuth: true,
      body: updateTagBody,
      response: {
        200: tagResponse,
        400: errorResponse,
        401: errorResponse,
        404: errorResponse,
        409: errorResponse,
      },
      detail: {
        summary: "Update tag",
        description: "Updates a tag owned by the current user.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/tags/:id",
    async ({ params, user }) => {
      await todoRepository.deleteTag(user.id, params.id);
      return { success: true, message: "Tag deleted" };
    },
    {
      isAuth: true,
      response: {
        200: successResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Delete tag",
        description: "Deletes a tag owned by the current user.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .get(
    "/:id",
    async ({ params, user }) => {
      const result = await todoRepository.findById(user.id, params.id);
      return {
        ...result.todo,
        tags: mapTags(result.tags),
        subtasks: result.subtasks,
      };
    },
    {
      isAuth: true,
      response: {
        200: todoResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Get todo",
        description: "Returns a single todo with tags and subtasks.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .put(
    "/:id",
    async ({ params, body, user }) => {
      const dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
      if (body.dueDate && Number.isNaN(dueDate?.getTime())) {
        throw new ValidationError("Invalid due date");
      }

      const result = await todoRepository.update(user.id, params.id, {
        title: body.title,
        description: body.description,
        completed: body.completed,
        importance: body.importance,
        dueDate: body.dueDate === null ? null : dueDate,
        tags: body.tags,
        subtasks: body.subtasks,
      });

      return {
        ...result.todo,
        tags: mapTags(result.tags),
        subtasks: result.subtasks,
      };
    },
    {
      isAuth: true,
      body: updateTodoBody,
      response: {
        200: todoResponse,
        400: errorResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Update todo",
        description:
          "Updates a todo and optionally replaces tags and subtasks.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  )
  .delete(
    "/:id",
    async ({ params, user }) => {
      await todoRepository.remove(user.id, params.id);
      return { success: true, message: "Todo deleted" };
    },
    {
      isAuth: true,
      response: {
        200: successResponse,
        401: errorResponse,
        404: errorResponse,
      },
      detail: {
        summary: "Delete todo",
        description: "Deletes a todo and related tags/subtasks relations.",
        tags: ["Todos"],
        security: [{ bearerAuth: [] }],
      },
    },
  );
