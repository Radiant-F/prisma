import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  MdDashboard,
  MdStar,
  MdCheckCircle,
  MdAdd,
  MdDeleteOutline,
  MdEdit,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { useLogoutMutation } from "@/features/auth/services/authApiSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout } from "@/features/auth/services/authReducer";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useListTagsQuery,
  useUpdateTagMutation,
} from "@/features/todo/services/todoApiSlice";
import {
  setMode,
  setTagId,
  type TodoFilterMode,
} from "@/features/todo/services/todoState";
import { LanguageSelect, ThemeSelect } from "@/components";
import { useI18n } from "@/i18n";

export const TodoSidebar = ({ className = "" }: { className?: string }) => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mode, tagId } = useAppSelector((state) => state.todoFilters);
  const [logoutApi, logoutState] = useLogoutMutation();
  const [createTag, createTagState] = useCreateTagMutation();
  const [updateTag, updateTagState] = useUpdateTagMutation();
  const [deleteTag, deleteTagState] = useDeleteTagMutation();
  const { data: tagsData } = useListTagsQuery();
  const [addingTag, setAddingTag] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isCreating },
  } = useForm<{ name: string; color: string }>({
    defaultValues: { name: "", color: "#8B5CF6" },
  });
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm<{ name: string; color: string }>({
    defaultValues: { name: "", color: "#8B5CF6" },
  });

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } finally {
      dispatch(logout());
      navigate("/auth");
    }
  };
  const navItems: Array<{
    icon: ReactNode;
    label: string;
    value: TodoFilterMode;
    iconClass?: string;
  }> = [
    { icon: <MdDashboard size={20} />, label: t("sidebarAll"), value: "all" },
    {
      icon: <MdStar size={20} />,
      label: t("sidebarImportant"),
      value: "important",
      iconClass: "text-amber-400",
    },
    {
      icon: <MdCheckCircle size={20} />,
      label: t("sidebarCompleted"),
      value: "completed",
    },
  ];

  const tags = tagsData?.items ?? [];

  const handleCreateTag = handleCreateSubmit(async (values) => {
    await createTag({
      name: values.name.trim(),
      color: values.color,
    }).unwrap();
    resetCreate({ name: "", color: "#8B5CF6" });
    setAddingTag(false);
  });

  const handleEditTag = (id: string, name: string, color?: string | null) => {
    setEditingTagId(id);
    resetEdit({ name, color: color ?? "#8B5CF6" });
  };

  const handleSaveTag = handleEditSubmit(async (values) => {
    if (!editingTagId) return;
    await updateTag({
      id: editingTagId,
      data: { name: values.name.trim(), color: values.color },
    }).unwrap();
    setEditingTagId(null);
  });

  const handleDeleteTag = async (id: string) => {
    await deleteTag(id).unwrap();
    if (tagId === id) {
      dispatch(setTagId(null));
    }
  };

  useEffect(() => {
    if (!addingTag) {
      resetCreate({ name: "", color: "#8B5CF6" });
    }
  }, [addingTag, resetCreate]);

  return (
    <aside
      className={`flex flex-col h-full theme-surface backdrop-blur-xl border-r ${className}`}
    >
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="font-bold text-[var(--text-primary)] text-lg">
            P
          </span>
        </div>
        <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Prisma
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {/* Main Filters */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                dispatch(setMode(item.value));
                dispatch(setTagId(null));
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium
                ${
                  mode === item.value
                    ? "bg-[var(--ghost-hover)] text-[var(--text-primary)] shadow-lg shadow-purple-500/10 border border-[var(--ghost-border)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                }`}
            >
              <span className={`transition-colors ${item.iconClass || ""}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Tags Section */}
        <div>
          <div className="px-4 mb-3 flex items-center justify-between text-xs font-semibold theme-subtle uppercase tracking-wider">
            <span>{t("sidebarTags")}</span>
            <button
              onClick={() => setAddingTag((value) => !value)}
              className="theme-subtle hover:text-[var(--text-primary)] transition-colors"
            >
              <MdAdd size={14} />
            </button>
          </div>
          {addingTag && (
            <form className="px-3 pb-2 space-y-2" onSubmit={handleCreateTag}>
              <input
                {...registerCreate("name", {
                  required: t("sidebarTagNameRequired"),
                  minLength: { value: 1, message: t("sidebarTagNameRequired") },
                  maxLength: { value: 32, message: t("sidebarTagMaxChars") },
                })}
                placeholder={t("sidebarNewTagPlaceholder")}
                className="w-full px-3 py-2 rounded-lg border text-xs outline-none theme-input theme-placeholder"
              />
              {createErrors.name && (
                <p className="text-xs text-rose-300">
                  {createErrors.name.message}
                </p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  {...registerCreate("color", {
                    pattern: {
                      value: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
                      message: t("sidebarColorHint"),
                    },
                  })}
                  className="h-8 w-10 rounded-lg border theme-input"
                />
                <button
                  type="submit"
                  disabled={createTagState.isLoading || isCreating}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] text-xs font-semibold text-[var(--text-primary)] transition disabled:opacity-70"
                >
                  {createTagState.isLoading || isCreating
                    ? t("sidebarSaving")
                    : t("sidebarAddTag")}
                </button>
              </div>
            </form>
          )}
          <div className="space-y-1">
            {tags.map((tag) => (
              <div key={tag.id} className="group relative">
                <button
                  onClick={() => dispatch(setTagId(tag.id))}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm
                    ${
                      tagId === tag.id
                        ? "bg-[var(--ghost-hover)] text-[var(--text-primary)] border border-[var(--ghost-border)]"
                        : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                    }`}
                >
                  <div
                    className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                    style={{ backgroundColor: tag.color ?? "#64748B" }}
                  />
                  <span>{tag.name}</span>
                  {typeof tag.usageCount === "number" && (
                    <span className="ml-auto text-xs theme-subtle group-hover:opacity-0 transition-opacity">
                      {tag.usageCount}
                    </span>
                  )}
                </button>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleEditTag(tag.id, tag.name, tag.color ?? null);
                    }}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--ghost-hover)]"
                  >
                    <MdEdit size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteTag(tag.id);
                    }}
                    disabled={deleteTagState.isLoading}
                    className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 disabled:opacity-60"
                  >
                    <MdDeleteOutline size={14} />
                  </button>
                </div>

                {editingTagId === tag.id && (
                  <form className="mt-2 mb-3 px-3" onSubmit={handleSaveTag}>
                    <div className="rounded-xl border theme-divider theme-card p-3 space-y-2">
                      <input
                        {...registerEdit("name", {
                          required: t("sidebarTagNameRequired"),
                          minLength: {
                            value: 1,
                            message: t("sidebarTagNameRequired"),
                          },
                          maxLength: {
                            value: 32,
                            message: t("sidebarTagMaxChars"),
                          },
                        })}
                        className="w-full px-3 py-2 rounded-lg border text-xs outline-none theme-input"
                      />
                      {editErrors.name && (
                        <p className="text-xs text-rose-300">
                          {editErrors.name.message}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          {...registerEdit("color", {
                            pattern: {
                              value: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
                              message: t("sidebarColorHint"),
                            },
                          })}
                          className="h-8 w-10 rounded-lg border theme-input"
                        />
                        <button
                          type="submit"
                          disabled={updateTagState.isLoading || isEditing}
                          className="flex-1 px-3 py-2 rounded-lg bg-[var(--ghost-bg)] hover:bg-[var(--ghost-hover)] text-xs font-semibold text-[var(--text-primary)] transition disabled:opacity-70"
                        >
                          {updateTagState.isLoading || isEditing
                            ? t("sidebarSaving")
                            : t("sidebarSave")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTagId(null)}
                          className="px-3 py-2 rounded-lg text-xs theme-muted hover:text-[var(--text-primary)]"
                        >
                          {t("sidebarCancel")}
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            ))}
            {!tags.length && (
              <div className="px-4 py-2 text-xs theme-subtle">
                {t("sidebarNoTags")}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t theme-divider space-y-3">
        <div className="flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider theme-subtle">
          <MdSettings size={16} />
          {t("sidebarSettings")}
        </div>
        <LanguageSelect
          showLabel
          className="flex-col items-start gap-2"
          selectClassName="w-full"
        />
        <ThemeSelect
          showLabel
          className="flex-col items-start gap-2"
          selectClassName="w-full"
        />
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutState.isLoading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500/90 hover:bg-rose-500/10 hover:text-rose-500 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <MdLogout size={20} />
          {logoutState.isLoading ? t("sidebarSigningOut") : t("sidebarSignOut")}
        </button>
      </div>
    </aside>
  );
};
