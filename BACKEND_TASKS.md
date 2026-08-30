# CollabBoard Backend Development Tasks

## Backend Technology

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API

---

# Team Backend Responsibilities

## Member 1 — Backend Project Setup & Architecture

Responsible for:

- Express server setup
- Backend folder structure
- Environment configuration
- CORS configuration
- JSON middleware
- Error handling architecture
- API health check
- Development scripts

Main files:

- `server/src/app.js`
- `server/src/server.js`
- `server/.env.example`
- `server/package.json`

Branch:

`feature/backend-setup`

---

## Member 2 — Database Developer

Responsible for:

- MongoDB connection
- Mongoose configuration
- Database models
- User schema
- Task schema
- Board schema
- Column schema

Main files:

- `server/src/config/db.js`
- `server/src/models/User.js`
- `server/src/models/Task.js`
- `server/src/models/Board.js`
- `server/src/models/Column.js`

Branch:

`feature/database`

---

## Member 3 — Registration Developer

Responsible for:

- User registration
- Registration validation
- Duplicate email checking
- Password hashing
- Creating new users

Main files:

- `server/src/controllers/authController.js`
- `server/src/routes/authRoutes.js`

Endpoint:

`POST /api/auth/register`

Branch:

`feature/register`

---

## Member 4 — Login & JWT Developer

Responsible for:

- User login
- Password verification
- JWT generation
- JWT authentication middleware
- Protected routes

Main files:

- `server/src/controllers/authController.js`
- `server/src/middleware/authMiddleware.js`
- `server/src/utils/generateToken.js`

Endpoint:

`POST /api/auth/login`

Branch:

`feature/login-jwt`

---

## Member 5 — User Profile Developer

Responsible for:

- Get current user
- View user profile
- Update user profile
- User information validation

Main files:

- `server/src/controllers/userController.js`
- `server/src/routes/userRoutes.js`

Endpoints:

`GET /api/users/profile`

`PUT /api/users/profile`

Branch:

`feature/user-profile`

---

## Member 6 — Task Management Backend Developer

Responsible for:

- Create tasks
- Read tasks
- Update tasks
- Delete tasks
- Task status
- Task priority
- Task assignment
- Task due dates

Main files:

- `server/src/controllers/taskController.js`
- `server/src/routes/taskRoutes.js`
- `server/src/services/taskService.js`

Endpoints:

`GET /api/tasks`

`POST /api/tasks`

`PUT /api/tasks/:id`

`DELETE /api/tasks/:id`

Branch:

`feature/task-management`

---

## Member 7 — Board & Column Developer

Responsible for:

- Board creation
- Board retrieval
- Column management
- To Do column
- Doing column
- Done column
- Moving tasks between columns

Main files:

- `server/src/controllers/boardController.js`
- `server/src/routes/boardRoutes.js`
- `server/src/services/boardService.js`

Branch:

`feature/board-management`

---

## Member 8 — Frontend & Backend Integration Developer

Responsible for:

- Connecting React frontend to backend
- API service
- Axios configuration
- Replacing mock task data
- API loading states
- API error handling
- Connecting authentication forms
- Connecting task management UI

Main frontend files may include:

- `src/services/api.js`
- `src/store/`
- `src/pages/`
- `src/components/`

Branch:

`feature/frontend-backend-integration`

---

## Member 9 — API Testing & Documentation Developer

Responsible for:

- Postman API testing
- Authentication testing
- Task API testing
- Board API testing
- Error testing
- API documentation
- Test evidence

Create:

`docs/API_TESTING.md`

Branch:

`feature/api-testing`

---

## Member 10 — Deployment & Security Developer

Responsible for:

- Environment variables
- Production configuration
- Deployment preparation
- Security configuration
- CORS production configuration
- Docker preparation if required
- Deployment documentation

Main files:

- `server/.env.example`
- `Dockerfile`
- deployment documentation

Branch:

`feature/deployment-security`

---

# Git Workflow

Every member must:

1. Pull the latest `main`
2. Create their own feature branch
3. Work only on their assigned files
4. Commit their changes
5. Push their branch
6. Create a Pull Request
7. Get another member to review the Pull Request
8. Merge into `main`

Do not commit directly to `main`.

---

# Important

Before starting a new feature, pull the latest changes from `main`.

Avoid modifying another member's files unless the team agrees.

If a shared file must be changed, communicate with the relevant member first.
