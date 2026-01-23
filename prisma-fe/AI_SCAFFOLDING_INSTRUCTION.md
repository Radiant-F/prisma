# Frontend Scaffolding Instruction (React Router v7 SSR)

You are a senior frontend architect and TypeScript engineer.

Your task is to scaffold a production-ready frontend project that **exactly matches the current frontend setup** in this repository. Follow all instructions carefully and **do not deviate** from the versions, tooling, or structure described below.

---

## CORE STACK & RUNTIME

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Runtime          | Node (Vite tooling)                     |
| Framework        | React 19                                |
| Router (SSR)     | React Router v7 (SSR enabled)           |
| Build Tool       | Vite 7                                  |
| Language         | TypeScript (strict)                     |
| State Management | Redux Toolkit + RTK Query               |
| Styling          | Tailwind CSS v4 (via @tailwindcss/vite) |
| Forms            | react-hook-form                         |
| Icons            | react-icons                             |
| Linting          | ESLint (flat config)                    |

> ✅ **Always use the latest versions** and install via Bun commands only. **Never** edit package.json manually for dependencies.

---

## REQUIRED DEPENDENCIES (LATEST VIA BUN)

Install dependencies using Bun only. **Do not edit package.json manually**.

### Dependencies (install with bun)

```bash
bun add \
  @react-router/node \
  @react-router/serve \
  @reduxjs/toolkit \
  @tailwindcss/vite \
  isbot \
  react \
  react-dom \
  react-hook-form \
  react-icons \
  react-redux \
  react-router \
  react-router-dom \
  tailwindcss
```

### Dev Dependencies (install with bun)

```bash
bun add -d \
  @eslint/js \
  @react-router/dev \
  @types/node \
  @types/react \
  @types/react-dom \
  @vitejs/plugin-react-swc \
  eslint \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  globals \
  typescript \
  typescript-eslint \
  vite
```

---

## REQUIRED SCRIPTS (package.json)

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "tsc -b && react-router build",
    "start": "react-router-serve build/server/index.js",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

---

## REACT ROUTER V7 + SSR SETUP

### 1) react-router.config.ts

```ts
import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: true,
} satisfies Config;
```

### 2) Vite configuration (vite.config.ts)

```ts
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### 3) App entry points (SSR)

#### src/entry.client.tsx

```tsx
import { HydratedRouter } from "react-router/dom";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>,
  );
});
```

#### src/entry.server.tsx

```tsx
import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter } from "react-router";
import type { EntryContext } from "react-router";

export const streamTimeout = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: any,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={routerContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}
```

### 4) Route configuration (src/routes.ts)

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/root/index.tsx"),
  route("auth", "pages/auth/index.tsx"),
  route("home", "pages/home/index.tsx"),
] satisfies RouteConfig;
```

---

## REDUX TOOLKIT + RTK QUERY

### Store (src/redux/store.ts)

```ts
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@/api/apiSlice";
import { authReducer } from "@/features/auth";
import { todoFiltersReducer } from "@/features/todo";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todoFilters: todoFiltersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### RTK Query base slice (src/api/apiSlice.ts)

```ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/redux/store";
import type { TokenResponse } from "@/features/auth/auth";
import { logout, setAccessToken } from "@/features/auth/services/authReducer";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args.url;
  const isAuthRequest = requestUrl?.startsWith("/auth/") ?? false;

  if (result.error && result.error.status === 401 && !isAuthRequest) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as TokenResponse;
      api.dispatch(setAccessToken(accessToken));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Todo", "Tag"],
  endpoints: () => ({}),
});
```

---

## TAILWIND CSS v4 SETUP

### Tailwind Vite plugin

Already wired in [vite.config.ts](vite.config.ts) via:

```ts
import tailwindcss from "@tailwindcss/vite";
// ...
plugins: [reactRouter(), tailwindcss()];
```

### Global stylesheet (src/index.css)

Keep the stylesheet minimal but include **basic light/dark theme variables** for placeholder pages:

```css
@import "tailwindcss";

:root {
  color-scheme: light dark;
  --page-bg: #0b0f19;
  --page-text: #e2e8f0;
}

:root[data-theme="light"] {
  color-scheme: light;
  --page-bg: #f8fafc;
  --page-text: #0f172a;
}

:root[data-theme="dark"] {
  color-scheme: dark;
}
```

---

## ENVIRONMENT CONFIGURATION

### .env.example

```env
VITE_API_BASE_URL=http://host:1337
```

---

## TYPE SCRIPT SETUP

### tsconfig.json

```jsonc
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
  ],
}
```

### tsconfig.app.json

```jsonc
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
    },
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["node", "vite/client", "@react-router/node"],
    "rootDirs": [".", "./.react-router/types"],
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
  },
  "include": ["src"],
}
```

---

## ESLINT SETUP (flat config)

### eslint.config.js

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
```

---

## ROOT LAYOUT & PROVIDERS

### src/root.tsx

```tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AuthBootstrap } from "./features/auth";
import { I18nProvider } from "./i18n";
import { ThemeProvider } from "./theme";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Project Name</title>
        <meta property="og:title" content="Project Name" />
        <meta property="og:description" content="Project description." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/vite.svg" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <ThemeProvider>
            <I18nProvider>
              <AuthBootstrap />
              {children}
            </I18nProvider>
          </ThemeProvider>
        </Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto theme-page min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{message}</h1>
      <p className="text-lg mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-black/50 rounded-lg">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
```

---

## THEME (LIGHT / DARK / SYSTEM)

Implement a theme system with three modes: `light`, `dark`, and `system` (follow device). **Default must be `system`.**

**Behavior requirements:**

- Store the selected mode (e.g., in localStorage).
- When mode is `system`, follow `prefers-color-scheme` and update on changes.
- Apply theme by setting `data-theme="light"` or `data-theme="dark"` on `document.documentElement`.
- If `system`, do not force `data-theme` unless you map it from the OS.

Minimal implementation can live in [src/theme/index.tsx](src/theme/index.tsx), and the provider must wrap the app as shown in [src/root.tsx](src/root.tsx).

---

## REACT HOOK FORM INTEGRATION

Use `react-hook-form` for all user forms. Each feature can include a local form component that uses the following pattern:

```tsx
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

export function ExampleForm() {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // handle values
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="email" {...register("email")} />
      <input type="password" {...register("password")} />
      {formState.errors.email && <span>Invalid email</span>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## BASIC LOCALIZATION (ENGLISH / INDONESIA)

Provide a minimal localization setup with **English (default)** and **Indonesia**. The placeholder pages should read their text from the localization layer.

**Requirements:**

- Default locale: `en`.
- Support `id`.
- Store selected locale (e.g., localStorage).
- Create a lightweight dictionary and context provider in [src/i18n/index.tsx](src/i18n/index.tsx).
- Use the provider in [src/root.tsx](src/root.tsx).

Example minimal dictionary:

```ts
const messages = {
  en: {
    pages: {
      root: "Welcome",
      auth: "Auth Page",
      home: "Home Page",
    },
  },
  id: {
    pages: {
      root: "Selamat Datang",
      auth: "Halaman Auth",
      home: "Halaman Beranda",
    },
  },
} as const;
```

The placeholder UI should render these strings in the page components.

---

## FOLDER STRUCTURE (EXACT)

```
project-name/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
├── react-router.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
├── src/
│   ├── api/
│   │   └── apiSlice.ts
│   ├── assets/
│   ├── components/
│   │   ├── ButtonPrimary.tsx
│   │   ├── ButtonSecondary.tsx
│   │   ├── FormInput.tsx
│   │   ├── LanguageSelect.tsx
│   │   ├── ThemeSelect.tsx
│   │   └── index.ts
│   ├── entry.client.tsx
│   ├── entry.server.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.d.ts
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   │   ├── AuthBootstrap.tsx
│   │   │   │   └── FormInput.tsx
│   │   │   └── services/
│   │   │       ├── authApiSlice.ts
│   │   │       └── authReducer.ts
│   │   ├── root/
│   │   │   ├── root.d.ts
│   │   │   ├── index.ts
│   │   │   └── components/
│   │   │       ├── Features.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── Hero.tsx
│   │   │       └── Navigation.tsx
│   │   └── todo/
│   │       ├── todo.d.ts
│   │       ├── index.ts
│   │       ├── components/
│   │       │   ├── FormInput.tsx
│   │       │   ├── TodoComposer.tsx
│   │       │   ├── TodoHeader.tsx
│   │       │   ├── TodoItem.tsx
│   │       │   ├── TodoList.tsx
│   │       │   └── TodoSidebar.tsx
│   │       └── services/
│   │           ├── todoApiSlice.ts
│   │           └── todoState.ts
│   ├── hooks/
│   │   └── index.ts
│   ├── i18n/
│   │   └── index.tsx
│   ├── index.css
│   ├── pages/
│   │   ├── auth/
│   │   │   └── index.tsx
│   │   ├── home/
│   │   │   └── index.tsx
│   │   └── root/
│   │       └── index.tsx
│   ├── redux/
│   │   └── store.ts
│   ├── routes.ts
│   ├── root.tsx
│   └── theme/
│       └── index.tsx
└── build/
    └── client/
```

---

## IMPORTANT IMPLEMENTATION RULES

1. **React Router v7 SSR must be enabled** (`ssr: true`) and use `@react-router/dev` tooling.
2. **Tailwind v4 must use `@tailwindcss/vite`** and only `@import "tailwindcss";` in [src/index.css](src/index.css).
3. **Redux store must include RTK Query** and set up the auth + todo slices exactly as shown.
4. **Use the alias `@` -> `src`** in both Vite and TS config.
5. **Keep file/folder naming identical** to the structure above.

---

## OPTIONAL: RUNNING LOCALLY

```bash
# Install
npm install

# Dev server (React Router SSR)
npm run dev

# Build
npm run build

# Serve SSR output
npm run start
```

> The current setup expects `VITE_API_BASE_URL` to be defined in `.env` or `.env.example`.
