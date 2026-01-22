import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  useDeleteTodoMutation,
  useGetTodosQuery,
  useListTagsQuery,
  useUpdateTodoMutation,
} from "../services/todoApiSlice";
import { setPage } from "../services/todoState";
import type { Todo } from "../todo";
import { TodoItem } from "./TodoItem";
import { useForm } from "react-hook-form";
import { useI18n } from "@/i18n";

interface TodoEditFormValues {
  title: string;
  description: string;
  dueDate: string;
  importance: number;
}

export const TodoList = () => {
  const { t } = useI18n();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.todoFilters);
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();
  const { data: tagsData } = useListTagsQuery();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editSubtasks, setEditSubtasks] = useState<
    Array<{ id: string; title: string; completed: boolean }>
  >([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TodoEditFormValues>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      importance: 3,
    },
  });

  const query = useMemo(() => {
    const params: Record<string, string | number | undefined> = {
      page: filters.page,
      pageSize: filters.pageSize,
    };

    if (filters.search) params.search = filters.search;
    if (filters.tagId) params.tagId = filters.tagId;
    if (filters.mode === "completed") params.completed = "true";
    if (filters.mode === "important") params.importanceMin = 4;

    return params;
  }, [filters]);

  const { data, isLoading } = useGetTodosQuery(query);

  const openEditor = (todo: Todo) => {
    setEditingTodo(todo);
    reset({
      title: todo.title,
      description: todo.description ?? "",
      dueDate: todo.dueDate ? todo.dueDate.slice(0, 10) : "",
      importance: todo.importance,
    });
    setEditTags(todo.tags.map((tag) => tag.id));
    setEditSubtasks(
      todo.subtasks.map((task) => ({
        id: task.id,
        title: task.title,
        completed: task.completed,
      })),
    );
  };

  const closeEditor = () => {
    setEditingTodo(null);
    setEditTags([]);
    setEditSubtasks([]);
    setNewSubtaskTitle("");
  };

  const handleToggleComplete = async (todo: Todo) => {
    await updateTodo({
      id: todo.id,
      data: { completed: !todo.completed },
    }).unwrap();
  };

  const handleToggleImportance = async (todo: Todo) => {
    await updateTodo({
      id: todo.id,
      data: { importance: todo.importance >= 4 ? 2 : 5 },
    }).unwrap();
  };

  const handleDelete = async (todo: Todo) => {
    await deleteTodo(todo.id).unwrap();
  };

  const handleToggleSubtask = async (todo: Todo, subtaskId: string) => {
    const updated = todo.subtasks.map((task) =>
      task.id === subtaskId ? { ...task, completed: !task.completed } : task,
    );

    await updateTodo({
      id: todo.id,
      data: {
        subtasks: updated.map((task, index) => ({
          title: task.title,
          completed: task.completed,
          order: index,
        })),
      },
    }).unwrap();
  };

  const handleSave = handleSubmit(async (values) => {
    if (!editingTodo) return;

    await updateTodo({
      id: editingTodo.id,
      data: {
        title: values.title.trim() || editingTodo.title,
        description: values.description.trim() ? values.description : null,
        dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
        importance: values.importance,
        tags: editTags,
        subtasks: editSubtasks.map((task, index) => ({
          title: task.title,
          completed: task.completed,
          order: index,
        })),
      },
    }).unwrap();

    closeEditor();
  });

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask = {
      id: crypto.randomUUID(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setEditSubtasks((prev) => [...prev, newSubtask]);
    setNewSubtaskTitle("");
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setEditSubtasks((prev) => prev.filter((task) => task.id !== subtaskId));
  };

  const handleToggleDraftSubtask = (subtaskId: string) => {
    setEditSubtasks((prev) =>
      prev.map((task) =>
        task.id === subtaskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  useEffect(() => {
    if (!editingTodo) {
      reset({
        title: "",
        description: "",
        dueDate: "",
        importance: 3,
      });
    }
  }, [editingTodo, reset]);

  return (
    <div className="space-y-4 pb-20">
      {isLoading && (
        <div className="text-sm theme-muted px-1">{t("todoLoading")}</div>
      )}

      {!isLoading && data?.items.length === 0 && (
        <div className="text-sm theme-subtle px-1">{t("todoEmpty")}</div>
      )}

      <div className="space-y-3">
        {data?.items.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={handleToggleComplete}
            onToggleImportance={handleToggleImportance}
            onToggleSubtask={handleToggleSubtask}
            onEdit={openEditor}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {editingTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSave}
            className="w-full max-w-2xl theme-surface-strong border theme-divider rounded-2xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {t("todoEditTaskTitle")}
              </h3>
              <button
                onClick={closeEditor}
                className="theme-muted hover:text-[var(--text-primary)]"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <input
                {...register("title", {
                  required: t("todoTitleRequired"),
                  minLength: { value: 1, message: t("todoTitleRequired") },
                })}
                className="w-full px-4 py-3 rounded-xl border outline-none theme-input"
                placeholder={t("todoTaskTitlePlaceholder")}
              />
              {errors.title && (
                <p className="text-xs text-rose-300">{errors.title.message}</p>
              )}
              <textarea
                {...register("description", {
                  maxLength: {
                    value: 5000,
                    message: t("todoDescriptionTooLong"),
                  },
                })}
                className="w-full px-4 py-3 rounded-xl border outline-none min-h-[100px] theme-input"
                placeholder={t("todoDescriptionLabel")}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="text-xs theme-muted">
                  {t("todoDueDateLabel")}
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="mt-1 w-full px-3 py-2 rounded-lg border theme-input"
                  />
                </label>
                <label className="text-xs theme-muted">
                  {t("todoPriorityLabel")}
                  <select
                    {...register("importance", { valueAsNumber: true })}
                    className="mt-1 w-full px-3 py-2 rounded-lg border theme-input"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option
                        key={level}
                        value={level}
                        className="text-slate-900"
                      >
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <p className="text-xs theme-muted mb-2">{t("todoTagsLabel")}</p>
                <div className="flex flex-wrap gap-2">
                  {(tagsData?.items ?? []).map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() =>
                        setEditTags((prev) =>
                          prev.includes(tag.id)
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id],
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        editTags.includes(tag.id)
                          ? "bg-[var(--ghost-hover)] text-[var(--text-primary)] border-[var(--ghost-border)]"
                          : "text-[var(--text-muted)] border-[var(--ghost-border)] hover:border-[var(--card-border-hover)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs theme-muted mb-2">
                  {t("todoSubtasksLabel")}
                </p>
                <div className="space-y-2">
                  {editSubtasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 border rounded-lg px-3 py-2 theme-input"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleDraftSubtask(task.id)}
                        className={`text-sm ${
                          task.completed
                            ? "text-emerald-500"
                            : "text-[var(--text-muted)]"
                        }`}
                      >
                        {task.completed ? "●" : "○"}
                      </button>
                      <input
                        value={task.title}
                        onChange={(event) =>
                          setEditSubtasks((prev) =>
                            prev.map((item) =>
                              item.id === task.id
                                ? { ...item, title: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className="flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(task.id)}
                        className="text-xs text-rose-500 hover:text-rose-600"
                      >
                        {t("todoRemove")}
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      value={newSubtaskTitle}
                      onChange={(event) =>
                        setNewSubtaskTitle(event.target.value)
                      }
                      placeholder={t("todoNewSubtaskPlaceholder")}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none theme-input theme-placeholder"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-3 py-2 rounded-lg bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] text-xs text-[var(--text-primary)]"
                    >
                      {t("todoAdd")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeEditor}
                className="px-4 py-2 text-xs theme-muted hover:text-[var(--text-primary)]"
              >
                {t("todoCancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white"
              >
                {isSubmitting ? t("todoSaving") : t("todoSaveChanges")}
              </button>
            </div>
          </form>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs theme-muted pt-2">
          <span>
            {t("todoPageLabel")} {data.page} {t("todoOfLabel")}{" "}
            {data.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-lg bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] transition"
              disabled={data.page <= 1}
              onClick={() => dispatch(setPage(Math.max(1, data.page - 1)))}
            >
              {t("todoPrev")}
            </button>
            <button
              className="px-3 py-1 rounded-lg bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] transition"
              disabled={data.page >= data.totalPages}
              onClick={() =>
                dispatch(setPage(Math.min(data.totalPages, data.page + 1)))
              }
            >
              {t("todoNext")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
