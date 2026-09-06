# Project Management SaaS --- Backend

Backend API for a Project Management SaaS application built with Bun,
TypeScript, Express, PostgreSQL, and Dbmate.

## Tech Stack

-   Bun
-   TypeScript
-   Express
-   PostgreSQL
-   `pg`
-   Zod
-   JWT
-   bcrypt
-   Dbmate

## Architecture

The backend follows a layered architecture:

``` text
HTTP Request
     ↓
   Route
     ↓
 Controller
     ↓
   Service
     ↓
 Repository
     ↓
 PostgreSQL
```

### Responsibilities

-   **Routes** --- Define API endpoints.
-   **Controllers** --- Handle HTTP requests and responses.
-   **Services** --- Contain business logic.
-   **Repositories** --- Contain PostgreSQL queries.
-   **Middleware** --- Authentication, validation, and error handling.
-   **Types/Schemas** --- TypeScript types and request validation.

## Project Structure

``` text
backend/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── db/
│   │   └── pool.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── projects/
│   │   │   └── members/
│   │   └── tasks/
│   │
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── response.ts
│   │
│   └── types/
│       └── express.d.ts
│
├── db/
│   └── migrations/
│
├── tests/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database

PostgreSQL database:

``` text
project-management-sass
```

Main tables:

``` text
users
  │
  ├── user_profiles
  │
  └── projects
        │
        ├── project_members
        │
        └── tasks
              │
              └── assigned_to → users
```

### Tables

-   `users`
-   `user_profiles`
-   `projects`
-   `project_members`
-   `tasks`

### Enums

-   `project_status`
    -   `active`
    -   `completed`
    -   `archived`
-   `task_status`
    -   `pending`
    -   `in_progress`
    -   `completed`
    -   `cancelled`
-   `member_role`
    -   `owner`
    -   `admin`
    -   `member`

## Environment Variables

Create a `.env` file:

``` env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/project-management-sass?sslmode=disable
PORT=3000
```

Never commit `.env` to Git.

## Installation

Install dependencies:

``` bash
bun install
```

Start the development server:

``` bash
bun run dev
```

Run the production server:

``` bash
bun run start
```

Type-check the project:

``` bash
bun run typecheck
```

## Database Migrations

Check migration status:

``` bash
dbmate status
```

Run migrations:

``` bash
dbmate up
```

Rollback the latest migration:

``` bash
dbmate down
```

Create a migration:

``` bash
dbmate new migration_name
```

## Health Check

The backend exposes:

``` http
GET /health
```

Expected response:

``` json
{
  "success": true,
  "message": "API and database are working",
  "databaseTime": "..."
}
```

This verifies that:

``` text
Client
  ↓
Express
  ↓
pg
  ↓
PostgreSQL
```

is working.

## API Endpoints

### Authentication

``` http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Users

User profile information is returned together with the user. There is no
separate profile API.

``` http
GET    /api/users
GET    /api/users/:userId
PATCH  /api/users/:userId
DELETE /api/users/:userId
```

### Projects

``` http
GET    /api/projects
POST   /api/projects
GET    /api/projects/:projectId
PATCH  /api/projects/:projectId
DELETE /api/projects/:projectId
```

### Project Members

Project members are kept inside the projects module.

``` http
GET    /api/projects/:projectId/members
POST   /api/projects/:projectId/members
PATCH  /api/projects/:projectId/members/:userId
DELETE /api/projects/:projectId/members/:userId
```

### Tasks

``` http
GET    /api/projects/:projectId/tasks
POST   /api/projects/:projectId/tasks

GET    /api/tasks/:taskId
PATCH  /api/tasks/:taskId
DELETE /api/tasks/:taskId
```

## Authentication Flow

``` text
Register
   ↓
Validate input
   ↓
Hash password with bcrypt
   ↓
Create user
   ↓
Create profile
```

Login:

``` text
Email + Password
       ↓
Find User
       ↓
Compare Password
       ↓
Generate JWT
       ↓
Return Token
```

Protected request:

``` text
Authorization: Bearer <JWT>
                ↓
        auth.middleware.ts
                ↓
           Verify JWT
                ↓
            req.user
```

## Development Plan

### Day 1 --- Foundation + Users

-   Project structure
-   PostgreSQL connection
-   Health check
-   User CRUD
-   User + profile response

### Day 2 --- Authentication

-   Register
-   Login
-   Logout
-   JWT
-   Password hashing
-   Current user

### Day 3 --- Projects

-   Create project
-   List projects
-   Get project
-   Update project
-   Delete project

### Day 4 --- Project Members

-   Add member
-   List members
-   Change role
-   Remove member

### Day 5 --- Tasks

-   Create task
-   List project tasks
-   Get task
-   Update task
-   Delete task
-   Assign task

### Day 6 --- Security & Quality

-   Authentication middleware
-   Authorization
-   Zod validation
-   Global error handling
-   Consistent API responses

### Day 7 --- Testing & Documentation

-   Test all endpoints
-   Test authentication
-   Test permissions
-   Test database migrations
-   Clean up code
-   Complete documentation

## API Design Rule

Use nested routes when working with resources belonging to a project:

``` text
/api/projects/:projectId/tasks
/api/projects/:projectId/members
```

Use direct resource routes when working with a specific resource:

``` text
/api/tasks/:taskId
/api/users/:userId
/api/projects/:projectId
```

## Development Priority

Build one complete vertical slice at a time:

``` text
Database
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
Route
   ↓
API Test
```

Do not add advanced features until the core modules are stable.

## Future Features

These are intentionally outside the initial one-week MVP:

-   Comments
-   Notifications
-   File attachments
-   Activity logs
-   Real-time updates
-   WebSockets
-   Redis
-   Background jobs
-   Email notifications
-   Advanced analytics
