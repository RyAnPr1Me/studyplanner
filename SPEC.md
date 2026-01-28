# AI Study Planner - Technical Specification

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Backend Specification](#backend-specification)
5. [Frontend Specification](#frontend-specification)
6. [Data Storage](#data-storage)
7. [Dynamic Tool System](#dynamic-tool-system)
8. [AI Integration Workflow](#ai-integration-workflow)
9. [Development Workflow](#development-workflow)
10. [Deployment](#deployment)

---

## Overview

The AI Study Planner is a Linux desktop application that combines AI-powered study planning with dynamically generated interactive tools. The application generates weekly study plans that break down into daily tasks, and provides AI-generated tools (calculators, timers, flashcards) that can be edited in real-time.

### Key Features
- **AI-Generated Study Plans**: Weekly plans automatically broken down into daily tasks
- **Dynamic Tool Generation**: AI creates custom tools based on study needs
- **Live AI Editing**: Real-time modification of tools through AI assistance
- **Google-Style UI**: Clean, modern interface inspired by Google's Material Design
- **Desktop-First**: Native Linux desktop experience via Electron

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Electron Main Process                     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Renderer)                 │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   Study     │  │   Dynamic    │  │     AI      │  │  │
│  │  │   Planner   │  │     Tool     │  │  Assistant  │  │  │
│  │  │   Views     │  │   Renderer   │  │     UI      │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│                    IPC Communication                         │
│                            ↕                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Rust Backend (via HTTP/IPC)              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  │
│  │  │   API    │  │   AI     │  │   Tool Engine    │   │  │
│  │  │ Handlers │  │ Service  │  │   (Code Gen)     │   │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    ┌───────────────┐
                    │   SQLite DB   │
                    │  + File Store │
                    └───────────────┘
                            ↕
                    ┌───────────────┐
                    │  AI Provider  │
                    │ (OpenAI/Local)│
                    └───────────────┘
```

### Component Breakdown

#### Frontend Layer (Electron + React)
- **Electron Main Process**: Window management, native OS integration
- **React Renderer**: UI components, state management
- **Material-UI**: Google-style component library
- **Dynamic Component Loader**: Runtime tool rendering system

#### Backend Layer (Rust)
- **Actix-Web Server**: RESTful API server
- **AI Service**: Interface to AI providers (OpenAI API, local models)
- **Tool Engine**: Dynamic tool code generation and validation
- **Data Layer**: SQLite database interactions

#### Storage Layer
- **SQLite Database**: Structured data (plans, users, tool metadata)
- **File System**: Generated tool code, assets, cache

---

## Technology Stack

### Backend
- **Language**: Rust (stable latest)
- **Framework**: Actix-Web 4.x
- **Database**: SQLite with `rusqlite` crate
- **Build Tool**: Cargo
- **Dependencies**:
  - `actix-web` - Web framework
  - `actix-cors` - CORS middleware
  - `serde` + `serde_json` - Serialization
  - `rusqlite` - SQLite interface
  - `tokio` - Async runtime
  - `reqwest` - HTTP client for AI API calls
  - `chrono` - Date/time handling
  - `uuid` - Unique identifiers
  - `dotenv` - Environment configuration
  - `jsonwebtoken` - Authentication (optional)

### Frontend
- **Framework**: React 18.x
- **Language**: TypeScript
- **Build Tool**: Vite
- **Desktop**: Electron 28.x
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Dependencies**:
  - `react` + `react-dom` - Core React
  - `@mui/material` - Material-UI components
  - `@mui/icons-material` - Material icons
  - `@reduxjs/toolkit` + `react-redux` - State management
  - `react-router-dom` - Routing
  - `axios` - HTTP client
  - `date-fns` - Date utilities
  - `react-markdown` - Markdown rendering
  - `monaco-editor` - Code editor for tool editing

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm/yarn (frontend), Cargo (backend)
- **Linting**: ESLint (frontend), Clippy (backend)
- **Formatting**: Prettier (frontend), rustfmt (backend)
- **Testing**: Jest + React Testing Library (frontend), cargo test (backend)

---

## Backend Specification

### Project Structure

```
backend/
├── Cargo.toml
├── Cargo.lock
├── src/
│   ├── main.rs              # Entry point, server initialization
│   ├── lib.rs               # Library exports
│   ├── api/
│   │   ├── mod.rs
│   │   ├── plans.rs         # Study plan endpoints
│   │   ├── tools.rs         # Dynamic tool endpoints
│   │   ├── ai.rs            # AI interaction endpoints
│   │   └── users.rs         # User management endpoints
│   ├── models/
│   │   ├── mod.rs
│   │   ├── plan.rs          # Study plan models
│   │   ├── tool.rs          # Tool models
│   │   └── user.rs          # User models
│   ├── services/
│   │   ├── mod.rs
│   │   ├── ai_service.rs    # AI provider integration
│   │   ├── plan_service.rs  # Plan generation logic
│   │   └── tool_service.rs  # Tool generation/execution
│   ├── db/
│   │   ├── mod.rs
│   │   ├── schema.rs        # Database schema
│   │   └── repository.rs    # Database operations
│   ├── utils/
│   │   ├── mod.rs
│   │   ├── config.rs        # Configuration management
│   │   └── errors.rs        # Error handling
│   └── middleware/
│       ├── mod.rs
│       └── auth.rs          # Authentication middleware
├── migrations/              # Database migrations
│   └── init.sql
├── tests/
│   ├── integration_tests.rs
│   └── api_tests.rs
└── .env.example             # Environment variables template
```

### API Endpoints

**Note**: For simplicity in this specification, API response examples show the direct data structure. In production implementation, all successful responses should be wrapped in a standard envelope format as documented in API.md:
```json
{
  "data": { /* actual response data */ },
  "timestamp": "2026-01-28T19:04:00Z"
}
```

#### Study Plans

**1. Generate Weekly Plan**
```
POST /api/plans/generate
Content-Type: application/json

Request:
{
  "user_id": "uuid",
  "subjects": ["Mathematics", "Physics", "Chemistry"],
  "goals": "Prepare for final exams",
  "study_hours_per_day": 4,
  "difficulty_level": "intermediate",
  "start_date": "2026-02-01"
}

Response:
{
  "plan_id": "uuid",
  "weekly_plan": {
    "week_start": "2026-02-01",
    "week_end": "2026-02-07",
    "subjects": [...],
    "daily_plans": [
      {
        "date": "2026-02-01",
        "day": "Monday",
        "tasks": [
          {
            "id": "uuid",
            "subject": "Mathematics",
            "topic": "Calculus - Derivatives",
            "duration_minutes": 90,
            "start_time": "09:00",
            "priority": "high",
            "resources": ["Chapter 4", "Practice problems 1-15"],
            "ai_notes": "Focus on chain rule and product rule"
          }
        ],
        "total_study_time": 240,
        "breaks": ["11:00", "15:00"]
      }
    ]
  },
  "ai_rationale": "Plan focuses on building fundamentals...",
  "generated_at": "2026-01-28T19:04:00Z"
}
```

**2. Get Daily Plan**
```
GET /api/plans/daily/{date}?user_id={uuid}

Response:
{
  "date": "2026-02-01",
  "tasks": [...],
  "completed_tasks": [],
  "suggested_tools": [
    {
      "tool_id": "uuid",
      "tool_type": "flashcard",
      "subject": "Mathematics"
    }
  ]
}
```

**3. Update Task Status**
```
PATCH /api/plans/tasks/{task_id}

Request:
{
  "status": "completed",
  "actual_duration": 85,
  "notes": "Completed all practice problems"
}

Response:
{
  "task_id": "uuid",
  "status": "completed",
  "updated_at": "2026-02-01T10:30:00Z"
}
```

**4. Regenerate Daily Plan**
```
POST /api/plans/daily/{date}/regenerate

Request:
{
  "user_id": "uuid",
  "adjustments": "More focus on practical examples",
  "keep_completed": true
}

Response:
{
  "daily_plan": {...},
  "changes": "Added 2 new practice sessions..."
}
```

#### Dynamic Tools

**5. Generate Tool**
```
POST /api/tools/generate

Request:
{
  "user_id": "uuid",
  "tool_type": "calculator|timer|flashcard|custom",
  "context": "Mathematics - Quadratic equations",
  "requirements": "Calculator for solving quadratic equations with step-by-step solution",
  "ui_preferences": {
    "theme": "light",
    "size": "medium"
  }
}

Response:
{
  "tool_id": "uuid",
  "tool_type": "calculator",
  "name": "Quadratic Equation Solver",
  "description": "Interactive calculator with step-by-step solutions",
  "component_code": "import React from 'react'...",
  "metadata": {
    "version": "1.0.0",
    "created_at": "2026-01-28T19:04:00Z",
    "ai_model": "gpt-4"
  },
  "preview_url": "/tools/preview/{tool_id}"
}
```

**6. List User Tools**
```
GET /api/tools?user_id={uuid}&type={type}&limit={n}

Response:
{
  "tools": [
    {
      "tool_id": "uuid",
      "name": "Quadratic Solver",
      "tool_type": "calculator",
      "usage_count": 15,
      "last_used": "2026-02-01T10:00:00Z"
    }
  ],
  "total": 10
}
```

**7. Get Tool**
```
GET /api/tools/{tool_id}

Response:
{
  "tool_id": "uuid",
  "name": "Quadratic Equation Solver",
  "component_code": "...",
  "metadata": {...}
}
```

**8. Update Tool (AI Live Editing)**
```
POST /api/tools/{tool_id}/edit

Request:
{
  "edit_instruction": "Add a graph visualization of the parabola",
  "current_state": {
    "user_context": "User is solving x^2 + 5x + 6 = 0"
  }
}

Response:
{
  "tool_id": "uuid",
  "updated_component_code": "...",
  "changes_summary": "Added D3.js graph component showing parabola visualization",
  "version": "1.1.0"
}
```

**9. Delete Tool**
```
DELETE /api/tools/{tool_id}

Response:
{
  "success": true,
  "message": "Tool deleted successfully"
}
```

#### AI Interactions

**10. AI Chat**
```
POST /api/ai/chat

Request:
{
  "user_id": "uuid",
  "message": "How should I approach learning calculus derivatives?",
  "context": {
    "current_plan": "plan_id",
    "current_subject": "Mathematics"
  }
}

Response:
{
  "response": "Based on your study plan, I recommend...",
  "suggested_actions": [
    {
      "type": "generate_tool",
      "description": "Create derivative practice flashcards"
    }
  ],
  "conversation_id": "uuid"
}
```

**11. Get AI Suggestions**
```
POST /api/ai/suggest

Request:
{
  "user_id": "uuid",
  "context": "daily_plan",
  "data": {...}
}

Response:
{
  "suggestions": [
    "Consider taking a 15-minute break",
    "Your progress in Mathematics is excellent",
    "Try the quadratic equation flashcards"
  ]
}
```

#### User Management

**12. Create/Update User Profile**
```
POST /api/users/profile

Request:
{
  "name": "John Doe",
  "preferences": {
    "study_hours_per_day": 4,
    "preferred_subjects": ["Math", "Physics"],
    "difficulty_level": "intermediate",
    "break_frequency": 90
  }
}

Response:
{
  "user_id": "uuid",
  "profile": {...},
  "created_at": "2026-01-28T19:04:00Z"
}
```

**13. Get User Statistics**
```
GET /api/users/{user_id}/stats

Response:
{
  "total_study_hours": 120,
  "completed_tasks": 45,
  "current_streak": 7,
  "tools_created": 5,
  "ai_interactions": 30,
  "subjects_progress": {
    "Mathematics": 75,
    "Physics": 60
  }
}
```

### Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid date format",
    "details": {
      "field": "start_date",
      "expected": "YYYY-MM-DD"
    }
  },
  "timestamp": "2026-01-28T19:04:00Z"
}
```

**Error Codes**:
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `NOT_FOUND` (404)
- `AI_SERVICE_ERROR` (503)
- `INTERNAL_ERROR` (500)

---

## Frontend Specification

### Project Structure

```
frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # Preload script
│   └── electron-builder.json
├── src/
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Root component
│   ├── index.css            # Global styles
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── AppBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── StudyPlan/
│   │   │   ├── WeeklyView.tsx
│   │   │   ├── DailyView.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── PlanGenerator.tsx
│   │   ├── Tools/
│   │   │   ├── ToolGallery.tsx
│   │   │   ├── ToolRenderer.tsx
│   │   │   ├── ToolEditor.tsx
│   │   │   └── templates/
│   │   │       ├── Calculator.tsx
│   │   │       ├── Timer.tsx
│   │   │       └── Flashcard.tsx
│   │   ├── AI/
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   └── Suggestions.tsx
│   │   └── Common/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Loading.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── WeeklyPlan.tsx
│   │   ├── DailyPlan.tsx
│   │   ├── ToolsPage.tsx
│   │   └── Settings.tsx
│   ├── store/
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── planSlice.ts
│   │   │   ├── toolSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── aiSlice.ts
│   │   └── api/
│   │       ├── planApi.ts
│   │       ├── toolApi.ts
│   │       └── aiApi.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── toolRenderer.ts
│   │   └── validators.ts
│   ├── hooks/
│   │   ├── useStudyPlan.ts
│   │   ├── useDynamicTool.ts
│   │   └── useAI.ts
│   └── types/
│       ├── plan.ts
│       ├── tool.ts
│       └── api.ts
├── public/
│   └── assets/
└── tests/
    ├── components/
    └── integration/
```

### UI Design Guidelines (Google-Style)

#### Color Palette
```css
/* Primary Colors */
--primary-blue: #1a73e8;
--primary-blue-hover: #1557b0;
--primary-blue-light: #e8f0fe;

/* Accent Colors */
--accent-green: #1e8e3e;
--accent-red: #d93025;
--accent-yellow: #f9ab00;

/* Neutrals */
--gray-50: #f8f9fa;
--gray-100: #f1f3f4;
--gray-200: #e8eaed;
--gray-300: #dadce0;
--gray-700: #5f6368;
--gray-900: #202124;

/* Text */
--text-primary: #202124;
--text-secondary: #5f6368;
```

#### Typography
```css
/* Font Family */
font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;

/* Font Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
```

#### Component Patterns

**Cards**
- Border radius: 8px
- Box shadow: 0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)
- Padding: 16px - 24px
- Background: white

**Buttons**
- Primary: Blue background, white text
- Secondary: White background, blue text, blue border
- Text: No background, blue text
- Border radius: 4px
- Height: 36px (medium), 32px (small), 40px (large)

**Input Fields**
- Border: 1px solid #dadce0
- Focus: 2px solid #1a73e8
- Border radius: 4px
- Height: 40px

### Key React Components

#### 1. DynamicToolRenderer
```typescript
interface ToolRendererProps {
  toolId: string;
  code: string;
  onUpdate?: (newCode: string) => void;
  editMode?: boolean;
}

// Component dynamically renders React code from AI-generated tools
// Uses React.lazy() and dynamic imports for safety
```

#### 2. WeeklyPlanView
```typescript
interface WeeklyPlanViewProps {
  weekStart: Date;
  onDateChange: (date: Date) => void;
  onTaskComplete: (taskId: string) => void;
  onRegeneratePlan: () => void;
}

// Displays 7-day calendar view with task breakdown
// Supports drag-and-drop task rescheduling
```

#### 3. AIAssistant
```typescript
interface AIAssistantProps {
  context: PlanContext;
  onActionSuggest: (action: AIAction) => void;
  position: 'sidebar' | 'floating';
}

// Persistent AI chat interface
// Contextual suggestions based on current activity
```

### State Management

**Redux Store Structure**
```typescript
{
  user: {
    profile: UserProfile;
    preferences: UserPreferences;
    stats: UserStats;
  },
  plans: {
    weekly: WeeklyPlan | null;
    daily: DailyPlan | null;
    tasks: Task[];
    loading: boolean;
  },
  tools: {
    userTools: Tool[];
    activeTools: Tool[];
    currentTool: Tool | null;
  },
  ai: {
    chatHistory: Message[];
    suggestions: Suggestion[];
    isProcessing: boolean;
  }
}
```

---

## Data Storage

### Database Schema (SQLite)

```sql
-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    preferences_json TEXT -- JSON blob for flexible preferences
);

-- Study plans table
CREATE TABLE study_plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_type TEXT CHECK(plan_type IN ('weekly', 'daily')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    subjects_json TEXT, -- JSON array of subjects
    ai_rationale TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL,
    date DATE NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    start_time TEXT,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'skipped')),
    resources_json TEXT, -- JSON array
    ai_notes TEXT,
    actual_duration INTEGER,
    user_notes TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE
);

-- Dynamic tools table
CREATE TABLE tools (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    tool_type TEXT NOT NULL CHECK(tool_type IN ('calculator', 'timer', 'flashcard', 'custom')),
    description TEXT,
    component_code TEXT NOT NULL, -- React component code
    metadata_json TEXT, -- JSON blob for tool-specific metadata
    version TEXT DEFAULT '1.0.0',
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI conversations table
CREATE TABLE ai_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context_json TEXT, -- JSON blob for conversation context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User statistics table
CREATE TABLE user_stats (
    user_id TEXT PRIMARY KEY,
    total_study_hours REAL DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    tools_created INTEGER DEFAULT 0,
    ai_interactions INTEGER DEFAULT 0,
    last_activity TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_tasks_plan_date ON tasks(plan_id, date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tools_user_type ON tools(user_id, tool_type);
CREATE INDEX idx_plans_user_date ON study_plans(user_id, start_date);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id, created_at);
```

### File Storage Structure

```
data/
├── database/
│   └── studyplanner.db       # SQLite database
├── tools/
│   ├── generated/
│   │   └── {tool_id}/
│   │       ├── component.tsx
│   │       ├── metadata.json
│   │       └── versions/
│   │           ├── v1.0.0.tsx
│   │           └── v1.1.0.tsx
│   └── templates/
│       ├── calculator_template.tsx
│       ├── timer_template.tsx
│       └── flashcard_template.tsx
├── cache/
│   └── ai_responses/
│       └── {hash}.json
└── logs/
    ├── app.log
    └── ai_requests.log
```

---

## Dynamic Tool System

### Tool Generation Workflow

```
User Request → AI Service → Code Generation → Validation → Storage → Render
```

#### Step-by-Step Process

**1. User Initiates Tool Generation**
```typescript
// User clicks "Create Tool" or AI suggests a tool
const request = {
  toolType: 'calculator',
  context: 'Quadratic equations',
  requirements: 'Step-by-step solver with graph'
};
```

**2. Backend Processes Request**
```rust
// ai_service.rs
async fn generate_tool_code(req: ToolGenerationRequest) -> Result<String> {
    // Construct AI prompt with template and requirements
    let prompt = build_tool_prompt(req);
    
    // Call AI API (OpenAI GPT-4 or local model)
    let ai_response = call_ai_api(prompt).await?;
    
    // Extract and validate React component code
    let component_code = extract_component_code(ai_response)?;
    
    // Security validation
    validate_code_safety(component_code)?;
    
    Ok(component_code)
}
```

**3. Code Validation**
```rust
fn validate_code_safety(code: &str) -> Result<()> {
    // Check for dangerous patterns
    let dangerous_patterns = [
        "eval(", "Function(", "innerHTML", 
        "dangerouslySetInnerHTML", "document.write"
    ];
    
    for pattern in dangerous_patterns {
        if code.contains(pattern) {
            return Err(ValidationError::UnsafeCode);
        }
    }
    
    // Validate TypeScript syntax (optional)
    // Run through esbuild or similar
    
    Ok(())
}
```

**4. Frontend Renders Tool**
```typescript
// ToolRenderer.tsx
const ToolRenderer: React.FC<ToolRendererProps> = ({ code, toolId }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  
  useEffect(() => {
    // Safely load component
    const loadComponent = async () => {
      try {
        // Create blob URL for the component
        const blob = new Blob([code], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        // Dynamic import
        const module = await import(/* @vite-ignore */ url);
        setComponent(() => module.default);
        
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to load tool:', error);
      }
    };
    
    loadComponent();
  }, [code]);
  
  if (!Component) return <Loading />;
  
  return <Component />;
};
```

### Tool Templates

#### Calculator Template
```typescript
// templates/calculator_template.tsx
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const QuadraticCalculator: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [solution, setSolution] = useState<string | null>(null);
  
  const solve = () => {
    // AI-generated solving logic with validation
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);
    
    // Validate inputs
    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setSolution('Please enter valid numbers');
      return;
    }
    
    if (numA === 0) {
      setSolution('Coefficient "a" cannot be zero for quadratic equation');
      return;
    }
    
    const discriminant = Math.pow(numB, 2) - 4 * numA * numC;
    if (discriminant < 0) {
      setSolution('No real solutions');
    } else {
      const x1 = (-numB + Math.sqrt(discriminant)) / (2 * numA);
      const x2 = (-numB - Math.sqrt(discriminant)) / (2 * numA);
      setSolution(`x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`);
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quadratic Equation Solver
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <TextField label="a" value={a} onChange={(e) => setA(e.target.value)} />
        <TextField label="b" value={b} onChange={(e) => setB(e.target.value)} />
        <TextField label="c" value={c} onChange={(e) => setC(e.target.value)} />
        <Button variant="contained" onClick={solve}>Solve</Button>
        {solution && (
          <Typography variant="body1" color="primary">
            {solution}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default QuadraticCalculator;
```

#### Timer Template
```typescript
// templates/timer_template.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';

const PomodoroTimer: React.FC = () => {
  const INITIAL_DURATION = 1500; // 25 minutes
  const [seconds, setSeconds] = useState(INITIAL_DURATION);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      // Notification
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);
  
  const progress = ((INITIAL_DURATION - seconds) / INITIAL_DURATION) * 100;
  
  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h4">
        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
      </Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ my: 2 }} />
      <Button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </Button>
    </Box>
  );
};

export default PomodoroTimer;
```

#### Flashcard Template
```typescript
// templates/flashcard_template.tsx
import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface FlashcardData {
  question: string;
  answer: string;
}

const MathFlashcards: React.FC = () => {
  const [cards] = useState<FlashcardData[]>([
    // AI generates these
    { question: 'What is the derivative of x²?', answer: '2x' },
    { question: 'What is ∫x dx?', answer: 'x²/2 + C' }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const next = () => {
    setShowAnswer(false);
    setCurrentIndex((i) => (i + 1) % cards.length);
  };
  
  return (
    <Card sx={{ minWidth: 300, minHeight: 200 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Card {currentIndex + 1} of {cards.length}
        </Typography>
        <Typography variant="body1" sx={{ my: 3 }}>
          {cards[currentIndex].question}
        </Typography>
        {showAnswer && (
          <Typography variant="h5" color="primary">
            {cards[currentIndex].answer}
          </Typography>
        )}
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? 'Hide' : 'Show'} Answer
          </Button>
          <Button onClick={next}>Next</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MathFlashcards;
```

### Live AI Editing

**Editing Workflow:**

1. User clicks "Edit Tool" → Tool enters edit mode
2. User provides natural language instruction: "Add a graph visualization"
3. Frontend sends current tool code + instruction to backend
4. Backend sends to AI with context:
   ```
   Current tool code: [component code]
   User request: "Add a graph visualization"
   Available libraries: React, MUI, D3.js
   Constraints: No external API calls, must be safe
   ```
5. AI returns updated code
6. Backend validates updated code
7. Frontend re-renders tool with new code
8. User can accept/reject changes

**Implementation:**
```typescript
// ToolEditor.tsx
const editTool = async (instruction: string) => {
  setEditing(true);
  
  const response = await api.post(`/api/tools/${toolId}/edit`, {
    edit_instruction: instruction,
    current_state: { /* context */ }
  });
  
  // Preview changes side-by-side
  setPreviewCode(response.updated_component_code);
  setShowPreview(true);
};

const acceptChanges = async () => {
  // Update tool with new code
  await api.patch(`/api/tools/${toolId}`, {
    component_code: previewCode,
    version: response.version
  });
  
  setCurrentCode(previewCode);
  setShowPreview(false);
};
```

---

## AI Integration Workflow

### AI Provider Configuration

**Supported Providers:**
1. **OpenAI API** (Primary)
   - GPT-4 for complex generation
   - GPT-3.5-turbo for faster responses
   
2. **Local Models** (Optional)
   - Ollama with CodeLlama
   - LM Studio with Mistral

**Configuration (`.env`):**
```bash
# AI Provider
AI_PROVIDER=openai  # or 'local'
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

# Local AI (optional)
LOCAL_AI_URL=http://localhost:11434
LOCAL_AI_MODEL=codellama

# AI Settings
AI_TEMPERATURE=0.7
AI_REQUEST_TIMEOUT=30
AI_CACHE_ENABLED=true
AI_CACHE_TTL=3600
```

### AI Prompts

#### Study Plan Generation Prompt
```
You are an expert study planner. Generate a detailed weekly study plan.

User Profile:
- Subjects: {subjects}
- Goals: {goals}
- Study hours per day: {hours}
- Difficulty level: {level}
- Start date: {date}

Requirements:
1. Create a balanced weekly schedule
2. Break down into daily tasks
3. Include specific topics and resources
4. Allocate appropriate time per task
5. Consider difficulty progression
6. Include breaks and review sessions

Output format: JSON following the DailyPlan schema
```

#### Tool Generation Prompt
```
You are an expert React developer. Generate a React component for a study tool.

Tool Type: {type}
Context: {context}
Requirements: {requirements}

Constraints:
- Use TypeScript
- Use Material-UI components (@mui/material)
- Must be a functional component
- No external API calls
- No dangerous code (eval, innerHTML, etc.)
- Include error handling
- Mobile-friendly design

Output: Complete React component code only, no explanations.
```

#### Tool Editing Prompt
```
You are editing a React study tool component.

Current Code:
{current_code}

User Request: {edit_instruction}

Available Context:
{current_state}

Instructions:
1. Modify the code to fulfill the user's request
2. Maintain existing functionality unless explicitly changing it
3. Keep the same component structure and exports
4. Follow Material-UI design patterns
5. Ensure backward compatibility where possible

Output: Updated complete component code only.
```

### AI Response Processing

```rust
// ai_service.rs
async fn process_ai_response(
    response: String,
    response_type: AIResponseType
) -> Result<ProcessedResponse> {
    match response_type {
        AIResponseType::StudyPlan => {
            // Parse JSON, validate schema
            let plan: WeeklyPlan = serde_json::from_str(&response)?;
            validate_plan(&plan)?;
            Ok(ProcessedResponse::Plan(plan))
        }
        AIResponseType::ToolCode => {
            // Extract code block, validate syntax
            let code = extract_code_block(&response)?;
            validate_code_safety(&code)?;
            Ok(ProcessedResponse::Code(code))
        }
        AIResponseType::Chat => {
            // Clean and format response
            let formatted = format_chat_response(&response)?;
            Ok(ProcessedResponse::Text(formatted))
        }
    }
}
```

### Caching Strategy

```rust
// Cache AI responses to reduce API calls and costs
struct AICache {
    cache: HashMap<String, CachedResponse>,
}

impl AICache {
    fn get(&self, key: &str) -> Option<&CachedResponse> {
        self.cache.get(key).filter(|r| !r.is_expired())
    }
    
    fn set(&mut self, key: String, response: String, ttl: Duration) {
        self.cache.insert(key, CachedResponse {
            data: response,
            expires_at: Instant::now() + ttl,
        });
    }
    
    fn generate_key(prompt: &str, params: &AIParams) -> String {
        // Hash prompt + parameters
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        
        let mut hasher = DefaultHasher::new();
        prompt.hash(&mut hasher);
        params.hash(&mut hasher);
        format!("{:x}", hasher.finish())
    }
}
```

---

## Development Workflow

### Initial Setup

**1. Clone and Setup Backend**
```bash
# Clone repository
git clone https://github.com/RyAnPr1Me/studyplanner.git
cd studyplanner

# Setup backend
cd backend
cargo build
cp .env.example .env
# Edit .env with your API keys

# Run migrations
sqlite3 data/database/studyplanner.db < migrations/init.sql

# Run backend
cargo run
# Server starts at http://localhost:8080
```

**2. Setup Frontend**
```bash
# Setup frontend
cd ../frontend
npm install

# Configure API endpoint
echo "VITE_API_URL=http://localhost:8080" > .env.local

# Run development server
npm run dev
# Frontend starts at http://localhost:5173
```

**3. Run as Electron App**
```bash
# Build frontend
npm run build

# Run Electron
npm run electron:dev
```

### Development Commands

**Backend:**
```bash
# Development
cargo run                    # Run server
cargo watch -x run          # Auto-reload on changes
cargo test                  # Run tests
cargo clippy                # Lint code
cargo fmt                   # Format code

# Production
cargo build --release       # Optimized build
```

**Frontend:**
```bash
# Development
npm run dev                 # Vite dev server
npm run test               # Run Jest tests
npm run lint               # ESLint
npm run format             # Prettier

# Production
npm run build              # Build for production
npm run electron:build     # Build Electron app
```

### Testing Strategy

**Backend Tests:**
```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[actix_web::test]
    async fn test_generate_weekly_plan() {
        let req = PlanGenerationRequest {
            user_id: "test-user".to_string(),
            subjects: vec!["Math".to_string()],
            // ... other fields
        };
        
        let result = generate_plan(req).await;
        assert!(result.is_ok());
        
        let plan = result.unwrap();
        assert_eq!(plan.daily_plans.len(), 7);
    }
    
    #[test]
    fn test_code_validation() {
        let safe_code = "const x = 1;";
        assert!(validate_code_safety(safe_code).is_ok());
        
        let unsafe_code = "eval('malicious code')";
        assert!(validate_code_safety(unsafe_code).is_err());
    }
}
```

**Frontend Tests:**
```typescript
// __tests__/ToolRenderer.test.tsx
import { render, screen } from '@testing-library/react';
import ToolRenderer from '../components/Tools/ToolRenderer';

describe('ToolRenderer', () => {
  it('renders tool component from code', async () => {
    const code = `
      export default function TestTool() {
        return <div>Test Tool</div>;
      }
    `;
    
    render(<ToolRenderer code={code} toolId="test-1" />);
    
    expect(await screen.findByText('Test Tool')).toBeInTheDocument();
  });
  
  it('handles invalid code gracefully', () => {
    const invalidCode = 'not valid javascript';
    
    render(<ToolRenderer code={invalidCode} toolId="test-2" />);
    
    expect(screen.getByText(/Error loading tool/i)).toBeInTheDocument();
  });
});
```

### Git Workflow

```bash
# Feature branches
git checkout -b feature/ai-chat-interface
# ... make changes ...
git commit -m "Add AI chat interface component"
git push origin feature/ai-chat-interface

# Create pull request on GitHub
```

### Code Quality Checks

**Pre-commit Hook (`.git/hooks/pre-commit`):**
```bash
#!/bin/bash

# Backend checks
cd backend
cargo fmt --check || exit 1
cargo clippy -- -D warnings || exit 1

# Frontend checks
cd ../frontend
npm run lint || exit 1
npm run format:check || exit 1

echo "✅ All checks passed"
```

---

## Deployment

### Build for Production

**1. Backend Binary**
```bash
cd backend
cargo build --release
# Binary at: target/release/studyplanner-backend

# Strip debug symbols (optional)
strip target/release/studyplanner-backend
```

**2. Electron Application**
```bash
cd frontend

# Build React app
npm run build

# Package Electron app for Linux
npm run electron:build

# Outputs:
# dist/studyplanner-1.0.0.AppImage
# dist/studyplanner-1.0.0.deb
# dist/studyplanner-1.0.0.rpm
```

### Distribution Package Structure

```
studyplanner-linux/
├── studyplanner              # Electron launcher
├── backend/
│   ├── studyplanner-backend  # Rust binary
│   └── data/
│       ├── database/
│       │   └── studyplanner.db (empty template)
│       └── tools/
│           └── templates/
├── resources/
│   ├── app.asar              # Frontend bundle
│   └── icon.png
├── lib/                      # Electron dependencies
├── LICENSE
└── README.md
```

### Installation Script

```bash
#!/bin/bash
# install.sh

INSTALL_DIR="/opt/studyplanner"
DATA_DIR="$HOME/.local/share/studyplanner"

# Create directories
sudo mkdir -p "$INSTALL_DIR"
mkdir -p "$DATA_DIR"

# Copy files
sudo cp -r * "$INSTALL_DIR/"

# Create desktop entry
cat > ~/.local/share/applications/studyplanner.desktop << EOF
[Desktop Entry]
Type=Application
Name=AI Study Planner
Exec=$INSTALL_DIR/studyplanner
Icon=$INSTALL_DIR/resources/icon.png
Categories=Education;
EOF

# Initialize database
cp "$INSTALL_DIR/backend/data/database/studyplanner.db" "$DATA_DIR/"

echo "Installation complete! Launch from applications menu or run: $INSTALL_DIR/studyplanner"
```

### Environment Configuration

**Production `.env`:**
```bash
# Database
DATABASE_PATH=/home/user/.local/share/studyplanner/studyplanner.db

# Server
SERVER_HOST=127.0.0.1
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=user_provided_key
OPENAI_MODEL=gpt-4

# Logging
RUST_LOG=info
LOG_FILE=/home/user/.local/share/studyplanner/logs/app.log
```

### Updates

**Auto-update Support (electron-updater):**
```typescript
// electron/main.ts
import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  // Notify user
});

autoUpdater.on('update-downloaded', () => {
  // Prompt to restart
});
```

### Performance Optimization

**Backend:**
- Connection pooling for database
- Response caching
- Async request handling
- Compiled release mode

**Frontend:**
- Code splitting
- Lazy loading of tools
- React.memo for expensive components
- Virtual scrolling for long lists

**Electron:**
- Preload scripts for IPC
- Process isolation
- Memory management

---

## Security Considerations

### Code Execution Safety

1. **Sandboxed Tool Execution**
   - Tools run in isolated context
   - No access to file system or network
   - Validated before execution

2. **Code Validation**
   - Regex-based dangerous pattern detection
   - TypeScript compilation check
   - Size limits on generated code

3. **User Data Protection**
   - Local-only storage (no cloud sync by default)
   - SQLite database with file permissions
   - No telemetry without consent

### API Security

1. **Rate Limiting**
   ```rust
   // Limit AI API calls per user
   const MAX_AI_CALLS_PER_HOUR: u32 = 100;
   ```

2. **Input Validation**
   ```rust
   // Validate all user inputs
   fn validate_plan_request(req: &PlanRequest) -> Result<()> {
       if req.study_hours_per_day < 1 || req.study_hours_per_day > 12 {
           return Err(ValidationError::InvalidHours);
       }
       // ... more validations
   }
   ```

3. **API Key Protection**
   - Never store API keys in code
   - Encrypt API keys at rest
   - User provides their own keys

---

## Future Enhancements

### Planned Features

1. **Cloud Sync** (Optional)
   - End-to-end encrypted sync
   - Multi-device support
   - Backup and restore

2. **Collaboration**
   - Study groups
   - Shared plans and tools
   - Progress comparison

3. **Advanced Analytics**
   - Study pattern analysis
   - Performance prediction
   - Personalized recommendations

4. **Mobile Companion App**
   - React Native version
   - Sync with desktop
   - Quick task updates

5. **Integration Plugins**
   - Calendar integration (Google Calendar, Outlook)
   - Note-taking apps (Notion, Obsidian)
   - Video learning platforms

6. **Offline AI Models**
   - Full offline support
   - Privacy-focused local AI
   - Smaller model options

---

## Conclusion

This specification provides a comprehensive blueprint for building the AI Study Planner application. The architecture balances power and simplicity, leveraging Rust for performance-critical backend operations and React for a rich, responsive user interface.

Key technical decisions:
- **Rust backend** ensures fast, safe API server
- **Electron + React** provides native desktop experience
- **SQLite** offers simple, reliable local storage
- **Dynamic component system** enables AI-generated tools
- **Material-UI** delivers Google-style aesthetics
- **Modular architecture** supports future enhancements

The system is designed to be:
- **Fast**: Rust performance, efficient rendering
- **Secure**: Code validation, sandboxed execution
- **Extensible**: Plugin-ready architecture
- **User-friendly**: Intuitive Google-style UI
- **Privacy-focused**: Local-first data storage

Next steps for implementation:
1. Set up project structure and dependencies
2. Implement core backend API endpoints
3. Build frontend component library
4. Integrate AI service
5. Develop dynamic tool rendering system
6. Test and refine user experience
7. Package and distribute

This specification serves as both a technical guide and a vision for creating a powerful, AI-enhanced study planning tool for Linux users.
