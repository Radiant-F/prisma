import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd, MdCalendarToday, MdLabelOutline } from "react-icons/md";
import {
  useCreateTodoMutation,
  useListTagsQuery,
} from "../services/todoApiSlice";
import { useI18n } from "@/i18n";

interface TodoComposerFormValues {
  title: string;
  description: string;
  dueDate: string;
  importance: number;
}

export const TodoComposer = () => {
  const { t } = useI18n();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [subtasks, setSubtasks] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [createTodo, createState] = useCreateTodoMutation();
  const { data: tagsData } = useListTagsQuery();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TodoComposerFormValues>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      importance: 3,
    },
  });

  const tags = useMemo(() => tagsData?.items ?? [], [tagsData]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const onSubmit = handleSubmit(async (values) => {
    await createTodo({
      title: values.title.trim(),
      description: values.description.trim()
        ? values.description.trim()
        : undefined,
      dueDate: values.dueDate
        ? new Date(values.dueDate).toISOString()
        : undefined,
      importance: values.importance,
      tags: selectedTags.length ? selectedTags : undefined,
      subtasks: subtasks.length
        ? subtasks.map((task, index) => ({
            title: task.title,
            order: index,
          }))
        : undefined,
    }).unwrap();

    reset();
    setSelectedTags([]);
    setShowTags(false);
    setSubtasks([]);
    setNewSubtask("");
  });

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: newSubtask.trim() },
    ]);
    setNewSubtask("");
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className="mb-8">
      <form
        className="theme-card backdrop-blur-md border rounded-2xl p-2 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:bg-[var(--card-hover)] transition-all shadow-lg shadow-black/20 mt-2.5"
        onSubmit={onSubmit}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="p-1 rounded-full bg-purple-500/20 text-purple-400">
            <MdAdd size={20} />
          </div>
          <input
            type="text"
            {...register("title", {
              required: t("todoTitleRequired"),
              minLength: { value: 1, message: t("todoTitleRequired") },
            })}
            placeholder={t("todoTitlePlaceholder")}
            className="bg-transparent border-none outline-none text-[var(--text-primary)] theme-placeholder w-full text-base py-2"
          />
        </div>
        {errors.title && (
          <div className="px-4 text-xs text-rose-300">
            {errors.title.message}
          </div>
        )}

        <div className="px-4 pb-2">
          <textarea
            {...register("description", {
              maxLength: {
                value: 5000,
                message: t("todoDescriptionTooLong"),
              },
            })}
            placeholder={t("todoDescriptionPlaceholder")}
            className="w-full min-h-[72px] bg-transparent border rounded-xl px-3 py-2 text-sm outline-none theme-input theme-placeholder"
          />
          {errors.description && (
            <div className="mt-1 text-xs text-rose-300">
              {errors.description.message}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-1 mt-1 border-t theme-divider pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium theme-muted hover:text-[var(--text-primary)] hover:bg-[var(--ghost-hover)] transition-colors cursor-pointer">
              <MdCalendarToday size={14} />
              <span>{t("todoDueLabel")}</span>
              <input
                type="date"
                {...register("dueDate")}
                className="bg-transparent text-xs text-[var(--text-primary)] outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowTags((value) => !value)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium theme-muted hover:text-[var(--text-primary)] hover:bg-[var(--ghost-hover)] transition-colors"
            >
              <MdLabelOutline size={14} />
              <span>{t("todoTagsLabel")}</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium theme-muted bg-[var(--ghost-bg)]">
              <span>{t("todoPriorityLabel")}</span>
              <select
                {...register("importance", { valueAsNumber: true })}
                className="bg-transparent text-[var(--text-primary)] text-xs outline-none"
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <option key={level} value={level} className="text-slate-900">
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={createState.isLoading || isSubmitting}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-purple-500/20 disabled:opacity-70"
          >
            {createState.isLoading || isSubmitting
              ? t("todoAdding")
              : t("todoAddTask")}
          </button>
        </div>

        {showTags && (
          <div className="px-4 pb-3 pt-2 border-t theme-divider flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  selectedTags.includes(tag.id)
                    ? "bg-[var(--ghost-hover)] text-[var(--text-primary)] border-[var(--ghost-border)]"
                    : "text-[var(--text-muted)] border-[var(--ghost-border)] hover:border-[var(--card-border-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tag.name}
              </button>
            ))}
            {!tags.length && (
              <span className="text-xs theme-subtle">{t("todoNoTags")}</span>
            )}
          </div>
        )}

        <div className="px-4 pb-4 pt-2 border-t theme-divider">
          <p className="text-xs theme-muted mb-2">{t("todoSubtasksLabel")}</p>
          <div className="space-y-2">
            {subtasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-2 border rounded-lg px-3 py-2 theme-input"
              >
                <input
                  value={task.title}
                  onChange={(event) =>
                    setSubtasks((prev) =>
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
                  onClick={() => handleRemoveSubtask(task.id)}
                  className="text-xs text-rose-500 hover:text-rose-600"
                >
                  {t("todoRemove")}
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={newSubtask}
                onChange={(event) => setNewSubtask(event.target.value)}
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
      </form>
    </div>
  );
};
