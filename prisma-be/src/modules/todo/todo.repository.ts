import { and, asc, desc, eq, gte, ilike, inArray, lte, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  tags,
  todoTags,
  todos,
  subtasks,
  type Tag,
  type Subtask,
  type Todo,
} from "../../db/schema";
import { ConflictError, NotFoundError } from "../../lib/errors";

type DbClient = typeof db;
type DbTransaction = Parameters<DbClient["transaction"]>[0] extends (
  tx: infer T,
) => any
  ? T
  : DbClient;
type DbExecutor = DbClient | DbTransaction;

export interface CreateTodoInput {
  title: string;
  description?: string | null;
  completed?: boolean;
  importance?: number;
  dueDate?: Date | null;
  tags?: string[];
  subtasks?: Array<{ title: string; completed?: boolean; order?: number }>;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  completed?: boolean;
  importance?: number;
  dueDate?: Date | null;
  tags?: string[];
  subtasks?: Array<{ title: string; completed?: boolean; order?: number }>;
}

export interface ListTodosInput {
  page: number;
  pageSize: number;
  search?: string;
  tag?: string;
  tagId?: string;
  dueFrom?: Date;
  dueTo?: Date;
  completed?: boolean;
  importanceMin?: number;
  importanceMax?: number;
  sort: "createdAt" | "dueDate" | "importance";
  order: "asc" | "desc";
}

const orderColumns = {
  createdAt: todos.createdAt,
  dueDate: todos.dueDate,
  importance: todos.importance,
} as const;

const buildTagsForTodo = (rows: Array<{ todoId: string } & Tag>) => {
  const grouped = new Map<string, Tag[]>();
  for (const row of rows) {
    const list = grouped.get(row.todoId) ?? [];
    list.push({
      id: row.id,
      userId: row.userId,
      name: row.name,
      color: row.color,
      createdAt: row.createdAt,
    });
    grouped.set(row.todoId, list);
  }
  return grouped;
};

const buildSubtasksForTodo = (rows: Array<{ todoId: string } & Subtask>) => {
  const grouped = new Map<string, Subtask[]>();
  for (const row of rows) {
    const list = grouped.get(row.todoId) ?? [];
    list.push({
      id: row.id,
      todoId: row.todoId,
      title: row.title,
      completed: row.completed,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
    grouped.set(row.todoId, list);
  }
  return grouped;
};

export const todoRepository = {
  async create(userId: string, data: CreateTodoInput) {
    return db.transaction(async (tx) => {
      const [todo] = await tx
        .insert(todos)
        .values({
          userId,
          title: data.title,
          description: data.description ?? null,
          completed: data.completed ?? false,
          importance: data.importance ?? 3,
          dueDate: data.dueDate ?? null,
        })
        .returning();

      const tagRows = await this.syncTags(tx, userId, todo.id, data.tags);
      const subtaskRows = await this.syncSubtasks(tx, todo.id, data.subtasks);

      return { todo, tags: tagRows, subtasks: subtaskRows };
    });
  },

  async update(userId: string, todoId: string, data: UpdateTodoInput) {
    return db.transaction(async (tx) => {
      const updateData: Partial<Todo> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) {
        updateData.description = data.description;
      }
      if (data.completed !== undefined) updateData.completed = data.completed;
      if (data.importance !== undefined)
        updateData.importance = data.importance;
      if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;

      let todo: Todo | undefined;

      if (Object.keys(updateData).length) {
        const [updated] = await tx
          .update(todos)
          .set(updateData)
          .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
          .returning();
        todo = updated;
      } else {
        const [existing] = await tx
          .select()
          .from(todos)
          .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
          .limit(1);
        todo = existing;
      }

      if (!todo) {
        throw new NotFoundError("Todo not found");
      }

      const tagRows = await this.syncTags(tx, userId, todo.id, data.tags);
      const subtaskRows = await this.syncSubtasks(tx, todo.id, data.subtasks);

      return { todo, tags: tagRows, subtasks: subtaskRows };
    });
  },

  async remove(userId: string, todoId: string) {
    const [deleted] = await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();

    if (!deleted) {
      throw new NotFoundError("Todo not found");
    }

    return deleted;
  },

  async findById(userId: string, todoId: string) {
    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .limit(1);

    if (!todo) {
      throw new NotFoundError("Todo not found");
    }

    const [tagRows, subtaskRows] = await Promise.all([
      db
        .select({
          todoId: todoTags.todoId,
          id: tags.id,
          userId: tags.userId,
          name: tags.name,
          color: tags.color,
          createdAt: tags.createdAt,
        })
        .from(todoTags)
        .innerJoin(tags, eq(todoTags.tagId, tags.id))
        .where(eq(todoTags.todoId, todoId)),
      db
        .select({
          todoId: subtasks.todoId,
          id: subtasks.id,
          title: subtasks.title,
          completed: subtasks.completed,
          order: subtasks.order,
          createdAt: subtasks.createdAt,
          updatedAt: subtasks.updatedAt,
        })
        .from(subtasks)
        .where(eq(subtasks.todoId, todoId))
        .orderBy(asc(subtasks.order), asc(subtasks.createdAt)),
    ]);

    const tagsGrouped = buildTagsForTodo(tagRows);
    const subtasksGrouped = buildSubtasksForTodo(subtaskRows);

    return {
      todo,
      tags: tagsGrouped.get(todoId) ?? [],
      subtasks: subtasksGrouped.get(todoId) ?? [],
    };
  },

  async list(userId: string, input: ListTodosInput) {
    const whereClauses = [eq(todos.userId, userId)];

    if (input.completed !== undefined) {
      whereClauses.push(eq(todos.completed, input.completed));
    }

    if (input.search) {
      const pattern = `%${input.search}%`;
      whereClauses.push(
        sql`(${todos.title} ILIKE ${pattern} OR coalesce(${todos.description}, '') ILIKE ${pattern})`,
      );
    }

    if (input.dueFrom) {
      whereClauses.push(gte(todos.dueDate, input.dueFrom));
    }

    if (input.dueTo) {
      whereClauses.push(lte(todos.dueDate, input.dueTo));
    }

    if (input.importanceMin !== undefined) {
      whereClauses.push(gte(todos.importance, input.importanceMin));
    }

    if (input.importanceMax !== undefined) {
      whereClauses.push(lte(todos.importance, input.importanceMax));
    }

    if (input.tag || input.tagId) {
      const tagTodoIds = db
        .select({ todoId: todoTags.todoId })
        .from(todoTags)
        .innerJoin(tags, eq(todoTags.tagId, tags.id))
        .where(
          and(
            eq(tags.userId, userId),
            input.tagId ? eq(tags.id, input.tagId) : undefined,
            input.tag ? eq(tags.name, input.tag) : undefined,
          ),
        );

      whereClauses.push(inArray(todos.id, tagTodoIds));
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todos)
      .where(and(...whereClauses));

    const offset = (input.page - 1) * input.pageSize;
    const orderByColumn = orderColumns[input.sort];
    const orderByFn = input.order === "asc" ? asc : desc;

    const items = await db
      .select()
      .from(todos)
      .where(and(...whereClauses))
      .orderBy(orderByFn(orderByColumn), desc(todos.createdAt))
      .limit(input.pageSize)
      .offset(offset);

    if (!items.length) {
      return {
        items: [],
        total: Number(count),
      };
    }

    const todoIds = items.map((todo) => todo.id);

    const [tagRows, subtaskRows] = await Promise.all([
      db
        .select({
          todoId: todoTags.todoId,
          id: tags.id,
          userId: tags.userId,
          name: tags.name,
          color: tags.color,
          createdAt: tags.createdAt,
        })
        .from(todoTags)
        .innerJoin(tags, eq(todoTags.tagId, tags.id))
        .where(inArray(todoTags.todoId, todoIds)),
      db
        .select({
          todoId: subtasks.todoId,
          id: subtasks.id,
          title: subtasks.title,
          completed: subtasks.completed,
          order: subtasks.order,
          createdAt: subtasks.createdAt,
          updatedAt: subtasks.updatedAt,
        })
        .from(subtasks)
        .where(inArray(subtasks.todoId, todoIds))
        .orderBy(asc(subtasks.order), asc(subtasks.createdAt)),
    ]);

    const tagsGrouped = buildTagsForTodo(tagRows);
    const subtasksGrouped = buildSubtasksForTodo(subtaskRows);

    return {
      items: items.map((todo) => ({
        todo,
        tags: tagsGrouped.get(todo.id) ?? [],
        subtasks: subtasksGrouped.get(todo.id) ?? [],
      })),
      total: Number(count),
    };
  },

  async listTags(userId: string, search?: string) {
    const clauses = [eq(tags.userId, userId)];
    if (search) {
      clauses.push(ilike(tags.name, `%${search}%`));
    }

    return db
      .select({
        id: tags.id,
        userId: tags.userId,
        name: tags.name,
        color: tags.color,
        createdAt: tags.createdAt,
        usageCount: sql<number>`count(${todoTags.todoId})`,
      })
      .from(tags)
      .leftJoin(todoTags, eq(todoTags.tagId, tags.id))
      .where(and(...clauses))
      .groupBy(tags.id, tags.userId, tags.name, tags.color, tags.createdAt)
      .orderBy(asc(tags.name));
  },

  async createTag(
    userId: string,
    data: { name: string; color?: string | null },
  ) {
    const [existing] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), eq(tags.name, data.name)))
      .limit(1);

    if (existing) {
      throw new ConflictError("Tag already exists");
    }

    const [tag] = await db
      .insert(tags)
      .values({
        userId,
        name: data.name,
        color: data.color ?? null,
      })
      .returning();

    return tag;
  },

  async getTagById(userId: string, tagId: string) {
    const [tag] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), eq(tags.id, tagId)))
      .limit(1);

    if (!tag) {
      throw new NotFoundError("Tag not found");
    }

    return tag;
  },

  async getTagUsageCount(tagId: string) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todoTags)
      .where(eq(todoTags.tagId, tagId));

    return Number(count);
  },

  async updateTag(
    userId: string,
    tagId: string,
    data: { name?: string; color?: string | null },
  ) {
    const [existing] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), eq(tags.id, tagId)))
      .limit(1);

    if (!existing) {
      throw new NotFoundError("Tag not found");
    }

    if (data.name && data.name !== existing.name) {
      const [conflict] = await db
        .select()
        .from(tags)
        .where(and(eq(tags.userId, userId), eq(tags.name, data.name)))
        .limit(1);

      if (conflict) {
        throw new ConflictError("Tag already exists");
      }
    }

    const updateData: Partial<Tag> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.color !== undefined) updateData.color = data.color;

    if (!Object.keys(updateData).length) {
      return existing;
    }

    const [updated] = await db
      .update(tags)
      .set(updateData)
      .where(and(eq(tags.userId, userId), eq(tags.id, tagId)))
      .returning();

    return updated ?? existing;
  },

  async deleteTag(userId: string, tagId: string) {
    const [deleted] = await db
      .delete(tags)
      .where(and(eq(tags.userId, userId), eq(tags.id, tagId)))
      .returning();

    if (!deleted) {
      throw new NotFoundError("Tag not found");
    }

    return deleted;
  },

  async syncTags(
    tx: DbExecutor,
    userId: string,
    todoId: string,
    tagIds?: string[],
  ) {
    if (!tagIds) {
      const existing = await tx
        .select({
          todoId: todoTags.todoId,
          id: tags.id,
          userId: tags.userId,
          name: tags.name,
          color: tags.color,
          createdAt: tags.createdAt,
        })
        .from(todoTags)
        .innerJoin(tags, eq(todoTags.tagId, tags.id))
        .where(eq(todoTags.todoId, todoId));
      const grouped = buildTagsForTodo(existing);
      return grouped.get(todoId) ?? [];
    }

    await tx.delete(todoTags).where(eq(todoTags.todoId, todoId));

    if (!tagIds.length) {
      return [];
    }

    const uniqueTagIds = Array.from(new Set(tagIds));

    const existing = await tx
      .select()
      .from(tags)
      .where(and(eq(tags.userId, userId), inArray(tags.id, uniqueTagIds)));

    if (existing.length !== uniqueTagIds.length) {
      throw new NotFoundError("Tag not found");
    }
    await tx
      .insert(todoTags)
      .values(existing.map((tag) => ({ todoId, tagId: tag.id })));

    return existing;
  },

  async syncSubtasks(
    tx: DbExecutor,
    todoId: string,
    items?: Array<{ title: string; completed?: boolean; order?: number }>,
  ) {
    if (!items) {
      return tx
        .select()
        .from(subtasks)
        .where(eq(subtasks.todoId, todoId))
        .orderBy(asc(subtasks.order), asc(subtasks.createdAt));
    }

    await tx.delete(subtasks).where(eq(subtasks.todoId, todoId));

    if (!items.length) {
      return [];
    }

    const normalized = items.map((item, index) => ({
      todoId,
      title: item.title,
      completed: item.completed ?? false,
      order: item.order ?? index,
    }));

    return tx.insert(subtasks).values(normalized).returning();
  },
};
