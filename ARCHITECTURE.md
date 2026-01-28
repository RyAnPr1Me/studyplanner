# Architecture Overview

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Linux Desktop OS                              │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                     Electron Application                          │ │
│  │                                                                    │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │              Main Process (Node.js)                       │   │ │
│  │  │  ├─ Window Management                                     │   │ │
│  │  │  ├─ IPC Handlers                                          │   │ │
│  │  │  ├─ Backend Process Manager                               │   │ │
│  │  │  └─ Native OS Integration                                 │   │ │
│  │  └──────────────────────────────────────────────────────────┘   │ │
│  │                            ↕ IPC                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │         Renderer Process (Chromium + React)               │   │ │
│  │  │                                                            │   │ │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────┐ │   │ │
│  │  │  │  Study Planner │  │  Dynamic Tools │  │ AI Chat UI │ │   │ │
│  │  │  │   UI Layer     │  │   Renderer     │  │  Interface │ │   │ │
│  │  │  └────────────────┘  └────────────────┘  └────────────┘ │   │ │
│  │  │                                                            │   │ │
│  │  │  ┌──────────────────────────────────────────────────┐    │   │ │
│  │  │  │           React Component Tree                    │    │   │ │
│  │  │  │  ┌─────────────────────────────────────────────┐ │    │   │ │
│  │  │  │  │  App (Router)                                │ │    │   │ │
│  │  │  │  │  ├─ Dashboard                                │ │    │   │ │
│  │  │  │  │  ├─ WeeklyPlan                               │ │    │   │ │
│  │  │  │  │  ├─ DailyPlan                                │ │    │   │ │
│  │  │  │  │  ├─ ToolsPage                                │ │    │   │ │
│  │  │  │  │  └─ Settings                                 │ │    │   │ │
│  │  │  │  └─────────────────────────────────────────────┘ │    │   │ │
│  │  │  │                                                    │    │   │ │
│  │  │  │  ┌─────────────────────────────────────────────┐ │    │   │ │
│  │  │  │  │  Redux Store (State Management)              │ │    │   │ │
│  │  │  │  │  ├─ planSlice                                │ │    │   │ │
│  │  │  │  │  ├─ toolSlice                                │ │    │   │ │
│  │  │  │  │  ├─ userSlice                                │ │    │   │ │
│  │  │  │  │  └─ aiSlice                                  │ │    │   │ │
│  │  │  │  └─────────────────────────────────────────────┘ │    │   │ │
│  │  │  └──────────────────────────────────────────────────┘    │   │ │
│  │  └────────────────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└────────────────────────────────────────────────────────────────────────┘
                                    ↕ HTTP/REST
┌────────────────────────────────────────────────────────────────────────┐
│                       Rust Backend Server                              │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    Actix-Web HTTP Server                          │ │
│  │                    (localhost:8080)                               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                    ↕                                   │
│  ┌────────────────┬─────────────────┬──────────────────────────────┐ │
│  │  API Routes    │  Middleware     │      Services                │ │
│  │  ├─ /plans     │  ├─ CORS        │  ├─ AI Service              │ │
│  │  ├─ /tools     │  ├─ Auth        │  │  ├─ OpenAI Client        │ │
│  │  ├─ /ai        │  ├─ Logging     │  │  ├─ Prompt Builder       │ │
│  │  ├─ /reminders │  └─ Error       │  │  └─ Response Parser      │ │
│  │  └─ /users     │                 │  ├─ Plan Service            │ │
│  │                │                 │  │  ├─ Weekly Generator     │ │
│  │                │                 │  │  └─ Daily Breakdown       │ │
│  │                │                 │  ├─ Tool Service            │ │
│  │                │                 │  │  ├─ Code Generator       │ │
│  │                │                 │  │  ├─ Code Validator       │ │
│  │                │                 │  │  └─ Version Manager      │ │
│  │                │                 │  └─ Reminder Service        │ │
│  │                │                 │     ├─ Notification Manager │ │
│  │                │                 │     ├─ Scheduler            │ │
│  │                │                 │     └─ Overdue Tracker      │ │
│  └────────────────┴─────────────────┴──────────────────────────────┘ │
│                                    ↕                                   │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    Data Access Layer                              │ │
│  │  ┌────────────────┬──────────────────┬─────────────────────────┐│ │
│  │  │  Repository    │  Models          │  Database Migrations    ││ │
│  │  │  ├─ PlanRepo   │  ├─ Plan         │  └─ init.sql            ││ │
│  │  │  ├─ ToolRepo   │  ├─ Tool         │                         ││ │
│  │  │  ├─ UserRepo   │  ├─ User         │                         ││ │
│  │  │  ├─ AIRepo     │  ├─ Conversation │                         ││ │
│  │  │  └─ ReminderRepo│ └─ Reminder     │                         ││ │
│  │  └────────────────┴──────────────────┴─────────────────────────┘│ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                        ↕                            ↕
        ┌───────────────────────┐      ┌────────────────────────┐
        │   SQLite Database     │      │   File System          │
        │  studyplanner.db      │      │  ├─ tool_code/         │
        │  ├─ users             │      │  ├─ templates/         │
        │  ├─ study_plans       │      │  └─ cache/             │
        │  ├─ tasks             │      └────────────────────────┘
        │  ├─ tools             │
        │  ├─ reminders         │
        │  ├─ ai_conversations  │
        │  └─ user_stats        │
        └───────────────────────┘
                        ↕
        ┌───────────────────────────────────┐
        │    External AI Provider           │
        │  ┌─────────────────────────────┐  │
        │  │  OpenAI API                 │  │
        │  │  ├─ GPT-4 (generation)      │  │
        │  │  └─ GPT-3.5 (fast responses)│  │
        │  └─────────────────────────────┘  │
        │           OR                      │
        │  ┌─────────────────────────────┐  │
        │  │  Local AI (Ollama)          │  │
        │  │  ├─ CodeLlama               │  │
        │  │  └─ Mistral                 │  │
        │  └─────────────────────────────┘  │
        └───────────────────────────────────┘
```

## Component Communication Flow

### 1. Study Plan Generation Flow

```
User Action: "Generate Weekly Plan"
    ↓
┌─────────────────────────────────────────┐
│ React Component (PlanGenerator.tsx)     │
│ - Validates input                        │
│ - Dispatches Redux action               │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Redux Thunk (planApi.ts)                │
│ - Calls backend API                      │
└─────────────────────────────────────────┘
    ↓ HTTP POST /api/plans/generate
┌─────────────────────────────────────────┐
│ Actix-Web Route Handler (plans.rs)     │
│ - Validates request                      │
│ - Calls plan service                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Plan Service (plan_service.rs)          │
│ - Constructs AI prompt                   │
│ - Calls AI service                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ AI Service (ai_service.rs)              │
│ - Sends to OpenAI/Local AI               │
│ - Parses response                        │
└─────────────────────────────────────────┘
    ↓ External API Call
┌─────────────────────────────────────────┐
│ OpenAI GPT-4 / Local Model              │
│ - Generates weekly plan JSON             │
└─────────────────────────────────────────┘
    ↓ JSON Response
┌─────────────────────────────────────────┐
│ Plan Service                             │
│ - Validates plan structure               │
│ - Saves to database                      │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Database Repository (repository.rs)     │
│ - INSERT INTO study_plans, tasks         │
└─────────────────────────────────────────┘
    ↓ Response
┌─────────────────────────────────────────┐
│ Redux Store Update                       │
│ - planSlice updated                      │
│ - Components re-render                   │
└─────────────────────────────────────────┘
    ↓
User sees weekly plan in UI
```

### 2. Dynamic Tool Generation Flow

```
User Action: "Create Calculator Tool"
    ↓
┌─────────────────────────────────────────┐
│ React Component (ToolGallery.tsx)       │
│ - User specifies tool requirements       │
│ - Shows loading state                    │
└─────────────────────────────────────────┘
    ↓ HTTP POST /api/tools/generate
┌─────────────────────────────────────────┐
│ Route Handler (tools.rs)                │
│ - Calls tool service                     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Tool Service (tool_service.rs)          │
│ - Builds prompt from template            │
│ - Calls AI service                       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ AI Service                               │
│ - Generates React component code         │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Code Validator (tool_service.rs)        │
│ - Checks for dangerous patterns          │
│ - Validates syntax                       │
│ - Saves to file system                   │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Database                                 │
│ - Stores tool metadata                   │
│ - Saves component code reference         │
└─────────────────────────────────────────┘
    ↓ Response with tool_id and code
┌─────────────────────────────────────────┐
│ ToolRenderer Component                   │
│ - Creates blob URL from code             │
│ - Dynamically imports component          │
│ - Renders in sandbox                     │
└─────────────────────────────────────────┘
    ↓
User interacts with generated tool
```

### 3. Live AI Tool Editing Flow

```
User Action: "Edit tool - add graph"
    ↓
┌─────────────────────────────────────────┐
│ ToolEditor Component                     │
│ - Captures edit instruction              │
│ - Shows current tool                     │
└─────────────────────────────────────────┘
    ↓ HTTP POST /api/tools/{id}/edit
┌─────────────────────────────────────────┐
│ Route Handler                            │
│ - Gets current tool code                 │
│ - Passes to AI service                   │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ AI Service                               │
│ - Sends: current code + edit instruction │
│ - Gets: updated component code           │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Code Validator                           │
│ - Re-validates updated code              │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ Version Manager                          │
│ - Increments version (1.0.0 → 1.1.0)    │
│ - Saves old version to versions/         │
│ - Updates current version                │
└─────────────────────────────────────────┘
    ↓ Response with updated code
┌─────────────────────────────────────────┐
│ ToolEditor Component                     │
│ - Shows side-by-side preview             │
│ - User accepts/rejects                   │
└─────────────────────────────────────────┘
    ↓ User accepts
┌─────────────────────────────────────────┐
│ ToolRenderer                             │
│ - Re-renders with new code               │
└─────────────────────────────────────────┘
    ↓
User sees updated tool
```

## Data Flow Patterns

### Unidirectional Data Flow (Frontend)

```
User Interaction
    ↓
Action Dispatched
    ↓
Redux Reducer
    ↓
State Updated
    ↓
Components Re-render
    ↓
View Updated
```

### Request-Response Pattern (Backend)

```
HTTP Request
    ↓
Middleware (CORS, Auth, Logging)
    ↓
Route Handler
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database/External API
    ↓
Response Back Through Layers
    ↓
HTTP Response
```

## Technology Stack Integration

### Frontend Stack
```
Electron 28.x
  └─ Main Process (Node.js)
  └─ Renderer Process
      └─ React 18.x (UI Framework)
          ├─ TypeScript (Type Safety)
          ├─ Material-UI (Component Library)
          ├─ Redux Toolkit (State Management)
          ├─ React Router (Navigation)
          └─ Axios (HTTP Client)
```

### Backend Stack
```
Rust (Language)
  └─ Cargo (Build System)
      └─ Actix-Web (Web Framework)
          ├─ Tokio (Async Runtime)
          ├─ Serde (Serialization)
          ├─ Rusqlite (Database)
          ├─ Reqwest (HTTP Client for AI APIs)
          └─ Chrono (Date/Time)
```

## Security Layers

```
┌────────────────────────────────────────┐
│ User Input                              │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│ Frontend Validation                     │
│ - Type checking (TypeScript)            │
│ - Input sanitization                    │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│ Backend Validation                      │
│ - Request schema validation             │
│ - Business rule checks                  │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│ Code Safety Validation                  │
│ - Pattern matching for dangerous code   │
│ - Syntax validation                     │
│ - Size limits                           │
└────────────────────────────────────────┘
    ↓
┌────────────────────────────────────────┐
│ Sandboxed Execution                     │
│ - Isolated component rendering          │
│ - No filesystem access                  │
│ - No network access from tools          │
└────────────────────────────────────────┘
```

## Scalability Considerations

### Current Architecture (Local Desktop)
- Single-user application
- Local SQLite database
- No network dependency (except AI API)
- Fast response times

### Future Scalability Path

```
Phase 1: Local Desktop (Current)
    ↓
Phase 2: Local + Optional Cloud Sync
    ├─ Add sync service
    ├─ E2E encryption
    └─ Conflict resolution
    ↓
Phase 3: Multi-device Support
    ├─ Mobile apps (React Native)
    ├─ Web version
    └─ Real-time sync
    ↓
Phase 4: Collaborative Features
    ├─ Shared study plans
    ├─ Tool marketplace
    └─ WebSocket real-time updates
```

## Development Architecture

### Development Environment
```
Developer Machine
    ├─ Frontend Dev Server (Vite)
    │   └─ http://localhost:5173
    │       └─ Hot Module Replacement
    │
    ├─ Backend Dev Server (Cargo)
    │   └─ http://localhost:8080
    │       └─ Auto-reload with cargo-watch
    │
    └─ Electron Dev
        └─ npm run electron:dev
            └─ Loads frontend from Vite
```

### Build Pipeline
```
Source Code
    ↓
┌──────────────┬─────────────────┐
│  Frontend    │    Backend      │
│  Build       │    Build        │
│  (Vite)      │    (Cargo)      │
└──────────────┴─────────────────┘
    ↓               ↓
┌──────────────┬─────────────────┐
│  dist/       │  target/release/│
│  (HTML/JS)   │  (binary)       │
└──────────────┴─────────────────┘
    ↓
Electron Builder
    ↓
┌───────────────────────────────┐
│  Linux Packages               │
│  ├─ .AppImage                 │
│  ├─ .deb                      │
│  └─ .rpm                      │
└───────────────────────────────┘
```

## Performance Optimization Points

1. **Frontend**
   - Code splitting by route
   - Lazy loading of tool components
   - Memoization of expensive calculations
   - Virtual scrolling for large lists

2. **Backend**
   - Connection pooling
   - Response caching (AI responses)
   - Async/await for I/O operations
   - Indexed database queries

3. **AI Integration**
   - Prompt caching
   - Response caching
   - Batch requests when possible
   - Timeout handling

4. **Electron**
   - Preload scripts for IPC
   - Process isolation
   - Memory management
   - Native module optimization

## Reminder and Due Date Tracking Data Flow

### Task Creation with Due Date

```
┌──────────────┐
│   Frontend   │
│  Task Form   │
└──────┬───────┘
       │ POST /api/plans/generate
       │ (with subjects & goals)
       ↓
┌──────────────────────────────┐
│  Backend: Plan Service       │
│  ├─ Parse user goals         │
│  ├─ AI generates tasks       │
│  └─ Extracts due dates       │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Task Repository             │
│  ├─ Save task with due_date  │
│  └─ Return task_id           │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Reminder Service            │
│  ├─ Check if due_date exists │
│  ├─ Create auto-reminders    │
│  │  (1 day before, 1hr before)│
│  └─ Save to reminders table  │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Frontend                    │
│  ├─ Display task with due    │
│  ├─ Show reminder badge      │
│  └─ Color-code by urgency    │
└──────────────────────────────┘
```

### Reminder Notification Flow

```
┌──────────────────────────────┐
│  Background Scheduler        │
│  (runs every minute)         │
│  ├─ Query pending reminders  │
│  └─ Filter by reminder_time  │
└──────┬───────────────────────┘
       │ Reminders due now
       ↓
┌──────────────────────────────┐
│  Reminder Service            │
│  ├─ Get task details         │
│  ├─ Format notification msg  │
│  └─ Send to notification mgr │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Notification Manager        │
│  ├─ Check notification_type  │
│  ├─ Send system notification │
│  └─ (Optional) Send email    │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Electron Main Process       │
│  ├─ Display desktop notif.   │
│  ├─ Play sound (optional)    │
│  └─ Handle user actions      │
└──────┬───────────────────────┘
       │ User clicks notification
       ↓
┌──────────────────────────────┐
│  Frontend                    │
│  ├─ Navigate to task         │
│  └─ Update reminder status   │
└──────────────────────────────┘
```

### Overdue Task Tracking

```
┌──────────────────────────────┐
│  User Opens Dashboard        │
└──────┬───────────────────────┘
       │ GET /api/tasks/overdue
       ↓
┌──────────────────────────────┐
│  Backend: Task Service       │
│  ├─ Get current date         │
│  ├─ Query tasks with:        │
│  │  • due_date < today       │
│  │  • status != completed    │
│  └─ Calculate days_overdue   │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│  Frontend                    │
│  ├─ Display overdue banner   │
│  ├─ Show in sidebar widget   │
│  ├─ Highlight in task list   │
│  └─ Offer quick reschedule   │
└──────────────────────────────┘
```

### Key Integration Points

1. **Plan Generation**: AI analyzes user goals to suggest due dates
2. **Task CRUD**: Due date updates trigger reminder rescheduling
3. **Notification System**: Integrates with Electron for desktop alerts
4. **Dashboard**: Shows overdue count and upcoming reminders
5. **Task Cards**: Display due date status with color coding
