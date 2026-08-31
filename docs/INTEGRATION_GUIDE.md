# Frontend ↔ Backend Integration Guide

**Author:** Member 8 — Frontend & Backend Integration Developer  
**Branch:** `feature/frontend-backend-integration`

---

## Overview

This guide explains the files created to connect the React frontend to the Express backend API. **No existing files were modified** — all integration work lives in new files.

---

## New Files Created

| File | Purpose |
|---|---|
| `src/services/api.js` | Axios instance with JWT interceptors + all API call functions |
| `src/store/authStore.js` | Authentication state management (Zustand + persist) |
| `src/pages/LoginPage.jsx` | Login form UI with error/loading states |
| `src/pages/RegisterPage.jsx` | Registration form UI with client-side validation |
| `src/components/ProtectedRoute.jsx` | Route guard — redirects unauthenticated users to `/login` |
| `src/AppRouter.jsx` | React Router setup wrapping the existing `App` component |
| `src/main_integrated.jsx` | New entry point (drop-in replacement for `main.jsx`) |
| `docs/INTEGRATION_GUIDE.md` | This file |

---

## How to Activate the Integrated Version

The existing `main.jsx` still works as before — it renders the Dashboard directly without authentication.

To switch to the integrated version with login/register:

1. Open `index.html` in the project root
2. Find the script tag:
   ```html
   <script type="module" src="/src/main.jsx"></script>
   ```
3. Change it to:
   ```html
   <script type="module" src="/src/main_integrated.jsx"></script>
   ```

That's it. The app will now show:
- `/login` — Login page
- `/register` — Registration page
- `/` — Dashboard (protected, requires authentication)

---

## API Endpoints Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new account | No |
| `POST` | `/api/auth/login` | Sign in and get JWT | No |
| `GET` | `/api/auth/me` | Get current user | Yes |

### Task Endpoints (Member 6)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks | Yes |
| `POST` | `/api/tasks` | Create a task | Yes |
| `PUT` | `/api/tasks/:id` | Update a task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

### User Endpoints (Member 5)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/profile` | Get user profile | Yes |
| `PUT` | `/api/users/profile` | Update user profile | Yes |

### Board Endpoints (Member 7)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/boards` | Get all boards | Yes |
| `POST` | `/api/boards` | Create a board | Yes |

> **Note:** Task, User, and Board endpoints will work once Members 5, 6, and 7 complete their backend implementations. The API functions in `src/services/api.js` are already prepared.

---

## How Authentication Works

### Flow

1. User visits `/` → `ProtectedRoute` checks for a stored JWT token
2. If no token → redirect to `/login`
3. User fills in email/password → `authStore.login()` calls `POST /api/auth/login`
4. Server returns `{ token, user }` → stored in Zustand state + persisted to `localStorage`
5. User is redirected to `/` → `ProtectedRoute` sees the token and renders the Dashboard
6. All subsequent API calls include `Authorization: Bearer <token>` via the Axios interceptor

### Token Storage

- Key: `collabboard-auth` in `localStorage`
- Contains: `{ state: { token, user } }`
- Auto-cleared on logout or when the server returns 401

### Auto-Logout

If any API call returns HTTP 401 (expired or invalid token):
1. The response interceptor clears `localStorage`
2. Redirects to `/login`

---

## How to Test the Integration

### Prerequisites

1. MongoDB running locally or a cloud connection string in `server/.env`
2. Backend server running:
   ```bash
   cd server
   npm install
   npm run dev
   ```
3. Frontend dev server running:
   ```bash
   npm install
   npm run dev
   ```

### Test Steps

1. **Register:** Go to `/register`, create an account
2. **Login:** Go to `/login`, sign in with the registered credentials
3. **Dashboard:** You should be redirected to `/` and see the board
4. **Refresh:** Refresh the page — you should stay logged in (persisted token)
5. **Logout:** (when implemented in UI) — should redirect to `/login`

---

## Dependencies

All dependencies are already installed in the project:

- `axios` — HTTP client (in `package.json`)
- `react-router-dom` — Client-side routing (in `package.json`)
- `zustand` — State management (in `package.json`)
- `@heroicons/react` — Icons (in `package.json`)

No new packages need to be installed.

---

## Notes for Other Team Members

- **Member 5 (User Profile):** The API functions `getUserProfileAPI()` and `updateUserProfileAPI()` in `src/services/api.js` are ready to use once your endpoints are built.
- **Member 6 (Task Management):** The API functions `fetchTasksAPI()`, `createTaskAPI()`, `updateTaskAPI()`, and `deleteTaskAPI()` are ready. When your endpoints are complete, the existing `taskStore.js` can be updated to call these instead of using mock data.
- **Member 7 (Board & Column):** The API functions `fetchBoardsAPI()` and `createBoardAPI()` are ready for your endpoints.
- **Member 9 (API Testing):** All endpoint paths are documented in the table above.
