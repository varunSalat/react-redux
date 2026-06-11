# Product Store

A React product management app with authentication and full CRUD operations. Users can sign in, browse a paginated product catalog, search items, and view, add, edit, or delete products. Data is fetched from the [DummyJSON](https://dummyjson.com) public API.

## Features

- **Authentication** — Login and registration with JWT tokens (access + refresh), persisted in local storage
- **Protected routes** — Product pages require a valid session; unauthenticated users are redirected to login
- **Product list** — Paginated catalog with search and summary stats
- **Product details** — Full product view with image gallery, reviews, and metadata
- **CRUD** — Add, edit, and delete products via dialog components
- **State management** — Redux Toolkit with async thunks for API calls
- **UI** — shadcn/ui components styled with Tailwind CSS

## Tech Stack

- React 19 + TypeScript
- Vite
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS 4 + shadcn/ui
- DummyJSON API

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

No environment variables are required — the app connects to `https://dummyjson.com` out of the box.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### 3. Log in

Use the demo credentials from [DummyJSON](https://dummyjson.com/docs/auth):

| Username | Password    |
| -------- | ----------- |
| `emilys` | `emilyspass` |

You can also register a new account at `/register`. After registration, sign in with the credentials you created.

## Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |
| `npm run format`  | Format source files with Prettier    |
| `npm run typecheck` | Run TypeScript without emitting    |

## Routes

| Path               | Access    | Description              |
| ------------------ | --------- | ------------------------ |
| `/login`           | Public    | Sign in                  |
| `/register`        | Public    | Create an account        |
| `/products`        | Protected | Product list with search |
| `/products/:id`    | Protected | Product details          |

## Project Structure

```
src/
├── components/       # UI and feature components
│   ├── auth/         # Login and register forms
│   ├── products/     # Product list, dialogs, skeletons
│   └── ui/           # shadcn/ui primitives
├── layouts/          # Auth and protected route layouts
├── lib/              # API client, storage, utilities
├── pages/            # Route-level page components
├── store/            # Redux store, slices, thunks, middleware
└── utils/            # Shared helpers
```

## API

All data comes from [DummyJSON](https://dummyjson.com):

- `POST /auth/login` — Authentication
- `POST /auth/refresh` — Token refresh
- `GET /auth/me` — Current user
- `POST /users/add` — Registration
- `GET /products` — List products (paginated)
- `GET /products/search` — Search products
- `GET /products/:id` — Product details
- `POST /products/add` — Create product
- `PUT /products/:id` — Update product
- `DELETE /products/:id` — Delete product

Note: DummyJSON is a mock API. Create, update, and delete operations simulate success but do not persist data on the server.
