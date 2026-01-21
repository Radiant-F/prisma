import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TodoFilterMode = "all" | "important" | "completed";

interface TodoFiltersState {
  search: string;
  tagId: string | null;
  mode: TodoFilterMode;
  page: number;
  pageSize: number;
}

const initialState: TodoFiltersState = {
  search: "",
  tagId: null,
  mode: "all",
  page: 1,
  pageSize: 10,
};

const todoFiltersSlice = createSlice({
  name: "todoFilters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setTagId: (state, action: PayloadAction<string | null>) => {
      state.tagId = action.payload;
      state.page = 1;
    },
    setMode: (state, action: PayloadAction<TodoFilterMode>) => {
      state.mode = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.page = 1;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearch,
  setTagId,
  setMode,
  setPage,
  setPageSize,
  resetFilters,
} = todoFiltersSlice.actions;

export const todoFiltersReducer = todoFiltersSlice.reducer;
