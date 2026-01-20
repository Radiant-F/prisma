import { describe, expect, it, beforeAll } from "bun:test";
import { treaty } from "@elysiajs/eden";
import app from "../app";

const api = treaty(app);

describe("Todo Module", () => {
  let accessToken = "";
  let username = "";
  const password = "password123";
  let designTagId = "";
  let frontendTagId = "";
  let backendTagId = "";

  beforeAll(async () => {
    username = `todo_${Math.random().toString(36).substring(7)}`;
    const { data, error } = await api.auth.signup.post({
      username,
      password,
    });

    expect(error).toBeNull();
    accessToken = data!.accessToken;

    const { data: designTag } = await api.todos.tags.post(
      {
        name: "Design",
        color: "#8B5CF6",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { data: frontendTag } = await api.todos.tags.post(
      {
        name: "Frontend",
        color: "#EC4899",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { data: backendTag } = await api.todos.tags.post(
      {
        name: "Backend",
        color: "#6366F1",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    designTagId = designTag!.id;
    frontendTagId = frontendTag!.id;
    backendTagId = backendTag!.id;
  });

  it("should create a todo with tags and subtasks", async () => {
    const { data, error } = await api.todos.post(
      {
        title: "Finish glassmorphism UI",
        description: "Apply the new design system",
        importance: 5,
        dueDate: new Date().toISOString(),
        tags: [designTagId, frontendTagId],
        subtasks: [
          { title: "Refine hero", order: 0 },
          { title: "Update cards", order: 1 },
        ],
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    expect(error).toBeNull();
    expect(data?.title).toBe("Finish glassmorphism UI");
    expect(data?.tags.length).toBe(2);
    expect(data?.subtasks.length).toBe(2);
  });

  it("should return paginated todos with search and tag filters", async () => {
    await api.todos.post(
      {
        title: "Backend cleanup",
        description: "Refactor repository layer",
        tags: [backendTagId],
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { data: searchData, error: searchError } = await api.todos.get({
      query: {
        search: "Backend",
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(searchError).toBeNull();
    expect(searchData?.items.length).toBeGreaterThan(0);

    const { data: tagData, error: tagError } = await api.todos.get({
      query: {
        tag: "Design",
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(tagError).toBeNull();
    expect(
      tagData?.items.some((todo) => todo.tags.some((t) => t.name === "Design")),
    ).toBe(true);
  });

  it("should filter by due date range", async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await api.todos.post(
      {
        title: "Due tomorrow",
        dueDate: tomorrow,
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { data, error } = await api.todos.get({
      query: {
        dueFrom: new Date().toISOString(),
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data?.items.length).toBeGreaterThan(0);
  });

  it("should list tags with search", async () => {
    const { data, error } = await api.todos.tags.get({
      query: {
        search: "Design",
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(error).toBeNull();
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.some((tag) => tag.name === "Design")).toBe(true);
  });

  it("should reject invalid tag colors", async () => {
    const { error: createError } = await api.todos.tags.post(
      {
        name: `BadColor_${Math.random().toString(36).substring(7)}`,
        color: "not-a-hex",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    expect(createError).not.toBeNull();
    expect(createError?.status).toBe(422);

    const { data: created } = await api.todos.tags.post(
      {
        name: `GoodColor_${Math.random().toString(36).substring(7)}`,
        color: "#A1B2C3",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { error: updateError } = await api.todos
      .tags({ id: created!.id })
      .put(
        {
          color: "#GGGGGG",
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );

    expect(updateError).not.toBeNull();
    expect(updateError?.status).toBe(422);
  });

  it("should create, update, get, and delete tags", async () => {
    const tagName = `Tag_${Math.random().toString(36).substring(7)}`;

    const { data: created, error: createError } = await api.todos.tags.post(
      {
        name: tagName,
        color: "#8B5CF6",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    expect(createError).toBeNull();
    expect(created?.name).toBe(tagName);

    const { data: fetched, error: fetchError } = await api.todos
      .tags({
        id: created!.id,
      })
      .get({
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

    expect(fetchError).toBeNull();
    expect(fetched?.id).toBe(created?.id);

    const { data: updated, error: updateError } = await api.todos
      .tags({
        id: created!.id,
      })
      .put(
        {
          name: `${tagName}_updated`,
          color: null,
        },
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      );

    expect(updateError).toBeNull();
    expect(updated?.name).toBe(`${tagName}_updated`);
    expect(updated?.color).toBeNull();
    expect(updated?.usageCount).toBeDefined();

    const { data: deleted, error: deleteError } = await api.todos
      .tags({
        id: created!.id,
      })
      .delete(undefined, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

    expect(deleteError).toBeNull();
    expect(deleted?.success).toBe(true);

    const { error: notFoundError } = await api.todos
      .tags({
        id: created!.id,
      })
      .get({
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

    expect(notFoundError).not.toBeNull();
    expect(notFoundError?.status).toBe(404);
  });

  it("should return usage counts for tags", async () => {
    const { data: tag } = await api.todos.tags.post(
      {
        name: `Count_${Math.random().toString(36).substring(7)}`,
        color: "#22C55E",
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    expect(tag?.usageCount).toBe(0);

    await api.todos.post(
      {
        title: "Tag usage example",
        tags: [tag!.id],
      },
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { data: listData } = await api.todos.tags.get({
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const counted = listData?.items.find((item) => item.id === tag?.id);
    expect(counted?.usageCount).toBe(1);

    const { data: fetched } = await api.todos.tags({ id: tag!.id }).get({
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    expect(fetched?.usageCount).toBe(1);
  });
});
