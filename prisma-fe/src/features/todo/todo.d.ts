export interface Tag {
  id: string;
  name: string;
  color?: string | null;
  usageCount?: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  importance: number;
  dueDate: string | null;
  tags: Tag[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface ListTodosResponse {
  items: Todo[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ListTagsResponse {
  items: Tag[];
}

export interface SubtaskInput {
  title: string;
  completed?: boolean;
  order?: number;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
  importance?: number;
  dueDate?: string;
  tags?: string[];
  subtasks?: SubtaskInput[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string | null;
  completed?: boolean;
  importance?: number;
  dueDate?: string | null;
  tags?: string[];
  subtasks?: SubtaskInput[];
}

export interface ListTodosQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  tagId?: string;
  dueFrom?: string;
  dueTo?: string;
  completed?: string;
  importanceMin?: number;
  importanceMax?: number;
  sort?: "createdAt" | "dueDate" | "importance";
  order?: "asc" | "desc";
}

export interface CreateTagRequest {
  name: string;
  color?: string | null;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string | null;
}
