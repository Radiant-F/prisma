import { apiSlice } from "@/api/apiSlice";
import type {
  CreateTagRequest,
  CreateTodoRequest,
  ListTagsResponse,
  ListTodosQuery,
  ListTodosResponse,
  Tag,
  Todo,
  UpdateTagRequest,
  UpdateTodoRequest,
} from "../todo";

export const todoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodos: builder.query<ListTodosResponse, ListTodosQuery>({
      query: (params) => ({
        url: "/todos",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Todo" as const, id: "LIST" },
              ...result.items.map((todo) => ({
                type: "Todo" as const,
                id: todo.id,
              })),
            ]
          : [{ type: "Todo" as const, id: "LIST" }],
    }),
    createTodo: builder.mutation<Todo, CreateTodoRequest>({
      query: (body) => ({
        url: "/todos",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Todo", id: "LIST" },
        { type: "Tag", id: "LIST" },
      ],
    }),
    updateTodo: builder.mutation<Todo, { id: string; data: UpdateTodoRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/todos/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: (_result, _error, { id }) => [
          { type: "Todo", id },
          { type: "Todo", id: "LIST" },
          { type: "Tag", id: "LIST" },
        ],
      },
    ),
    deleteTodo: builder.mutation<
      { success: boolean; message?: string },
      string
    >({
      query: (id) => ({
        url: `/todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Todo", id: "LIST" },
        { type: "Tag", id: "LIST" },
      ],
    }),
    listTags: builder.query<ListTagsResponse, { search?: string } | void>({
      query: (params) =>
        params ? { url: "/todos/tags", params } : { url: "/todos/tags" },
      providesTags: (result) =>
        result
          ? [
              { type: "Tag" as const, id: "LIST" },
              ...result.items.map((tag) => ({
                type: "Tag" as const,
                id: tag.id,
              })),
            ]
          : [{ type: "Tag" as const, id: "LIST" }],
    }),
    createTag: builder.mutation<Tag, CreateTagRequest>({
      query: (body) => ({
        url: "/todos/tags",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
    updateTag: builder.mutation<Tag, { id: string; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({
        url: `/todos/tags/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tag", id },
        { type: "Tag", id: "LIST" },
      ],
    }),
    deleteTag: builder.mutation<{ success: boolean; message?: string }, string>(
      {
        query: (id) => ({
          url: `/todos/tags/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: [{ type: "Tag", id: "LIST" }],
      },
    ),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useListTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = todoApiSlice;
