# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
Currently, the API uses user_id as a query parameter or in request body. Future versions will implement JWT-based authentication.

## Response Format

### Success Response
```json
{
  "data": { ... },
  "timestamp": "2026-01-28T19:04:00Z"
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  },
  "timestamp": "2026-01-28T19:04:00Z"
}
```

## Endpoints

### Study Plans

#### POST /api/plans/generate
Generate a new weekly study plan with AI.

**Request:**
```json
{
  "user_id": "string (uuid)",
  "subjects": ["string"],
  "goals": "string",
  "study_hours_per_day": "number (1-12)",
  "difficulty_level": "beginner|intermediate|advanced",
  "start_date": "string (YYYY-MM-DD)"
}
```

**Response:** `200 OK`
```json
{
  "plan_id": "uuid",
  "weekly_plan": {
    "week_start": "2026-02-01",
    "week_end": "2026-02-07",
    "subjects": ["Mathematics", "Physics"],
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
            "resources": ["Textbook Ch. 4", "Practice Set 1"],
            "ai_notes": "Focus on chain rule applications"
          }
        ],
        "total_study_time": 240,
        "breaks": ["11:00", "15:00"]
      }
    ]
  },
  "ai_rationale": "The plan builds progressively...",
  "generated_at": "2026-01-28T19:04:00Z"
}
```

#### GET /api/plans/daily/{date}
Get daily plan for a specific date.

**Query Parameters:**
- `user_id` (required): User UUID

**Response:** `200 OK`
```json
{
  "date": "2026-02-01",
  "tasks": [...],
  "completed_tasks": ["uuid1", "uuid2"],
  "suggested_tools": [
    {
      "tool_id": "uuid",
      "tool_type": "flashcard",
      "subject": "Mathematics"
    }
  ]
}
```

#### PATCH /api/plans/tasks/{task_id}
Update task status and details.

**Request:**
```json
{
  "status": "completed|in_progress|skipped",
  "actual_duration": "number (minutes)",
  "notes": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "task_id": "uuid",
  "status": "completed",
  "updated_at": "2026-02-01T10:30:00Z"
}
```

### Dynamic Tools

#### POST /api/tools/generate
Generate a new interactive tool using AI.

**Request:**
```json
{
  "user_id": "uuid",
  "tool_type": "calculator|timer|flashcard|custom",
  "context": "string (e.g., 'Quadratic equations')",
  "requirements": "string (detailed description)",
  "ui_preferences": {
    "theme": "light|dark",
    "size": "small|medium|large"
  }
}
```

**Response:** `200 OK`
```json
{
  "tool_id": "uuid",
  "tool_type": "calculator",
  "name": "Quadratic Equation Solver",
  "description": "Solves quadratic equations with steps",
  "component_code": "import React from 'react'...",
  "metadata": {
    "version": "1.0.0",
    "created_at": "2026-01-28T19:04:00Z",
    "ai_model": "gpt-4"
  },
  "preview_url": "/tools/preview/uuid"
}
```

#### GET /api/tools
List user's tools.

**Query Parameters:**
- `user_id` (required): User UUID
- `type` (optional): Filter by tool type
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset

**Response:** `200 OK`
```json
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
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

#### GET /api/tools/{tool_id}
Get specific tool details.

**Response:** `200 OK`
```json
{
  "tool_id": "uuid",
  "user_id": "uuid",
  "name": "Quadratic Equation Solver",
  "tool_type": "calculator",
  "description": "...",
  "component_code": "import React...",
  "metadata": {
    "version": "1.0.0",
    "created_at": "2026-01-28T19:04:00Z"
  }
}
```

#### POST /api/tools/{tool_id}/edit
Edit tool with AI assistance.

**Request:**
```json
{
  "edit_instruction": "Add graph visualization of the parabola",
  "current_state": {
    "user_context": "Currently solving x^2 + 5x + 6 = 0"
  }
}
```

**Response:** `200 OK`
```json
{
  "tool_id": "uuid",
  "updated_component_code": "import React...",
  "changes_summary": "Added D3.js graph component",
  "version": "1.1.0"
}
```

#### DELETE /api/tools/{tool_id}
Delete a tool.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tool deleted successfully"
}
```

### AI Interactions

#### POST /api/ai/chat
Chat with AI assistant.

**Request:**
```json
{
  "user_id": "uuid",
  "message": "How should I study calculus?",
  "context": {
    "current_plan": "plan_uuid",
    "current_subject": "Mathematics"
  }
}
```

**Response:** `200 OK`
```json
{
  "response": "Based on your study plan, I recommend...",
  "suggested_actions": [
    {
      "type": "generate_tool",
      "description": "Create derivative practice flashcards",
      "action_data": {
        "tool_type": "flashcard",
        "context": "Calculus derivatives"
      }
    }
  ],
  "conversation_id": "uuid"
}
```

#### POST /api/ai/suggest
Get AI suggestions based on context.

**Request:**
```json
{
  "user_id": "uuid",
  "context": "daily_plan|task|tool",
  "data": {
    "current_task_id": "uuid",
    "time_spent": 45,
    "progress": 0.6
  }
}
```

**Response:** `200 OK`
```json
{
  "suggestions": [
    "You're making great progress! Consider a 10-minute break.",
    "This topic pairs well with the quadratic solver tool.",
    "Try practicing with flashcards to reinforce learning."
  ],
  "priority": "low|medium|high"
}
```

### User Management

#### POST /api/users/profile
Create or update user profile.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {
    "study_hours_per_day": 4,
    "preferred_subjects": ["Mathematics", "Physics"],
    "difficulty_level": "intermediate",
    "break_frequency": 90,
    "theme": "light"
  }
}
```

**Response:** `200 OK`
```json
{
  "user_id": "uuid",
  "profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {...}
  },
  "created_at": "2026-01-28T19:04:00Z"
}
```

#### GET /api/users/{user_id}/stats
Get user statistics.

**Response:** `200 OK`
```json
{
  "total_study_hours": 120.5,
  "completed_tasks": 45,
  "current_streak": 7,
  "tools_created": 5,
  "ai_interactions": 30,
  "subjects_progress": {
    "Mathematics": 75,
    "Physics": 60,
    "Chemistry": 50
  },
  "weekly_activity": [
    {"date": "2026-01-22", "hours": 4.5},
    {"date": "2026-01-23", "hours": 3.0}
  ]
}
```

## Rate Limits

- **AI Generation Endpoints**: 20 requests per minute per user
- **Standard Endpoints**: 100 requests per minute per user
- **Tool Execution**: No limit (local execution)

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| AI_SERVICE_ERROR | 503 | AI provider unavailable |
| INTERNAL_ERROR | 500 | Server error |

## Examples

### Complete Workflow Example

```bash
# 1. Create user profile
curl -X POST http://localhost:8080/api/users/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "preferences": {
      "study_hours_per_day": 4,
      "preferred_subjects": ["Math", "Physics"]
    }
  }'

# Response: { "user_id": "user-123", ... }

# 2. Generate weekly plan
curl -X POST http://localhost:8080/api/plans/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "subjects": ["Mathematics", "Physics"],
    "goals": "Exam preparation",
    "study_hours_per_day": 4,
    "difficulty_level": "intermediate",
    "start_date": "2026-02-01"
  }'

# Response: { "plan_id": "plan-456", "weekly_plan": {...}, ... }

# 3. Get today's plan
curl -X GET "http://localhost:8080/api/plans/daily/2026-02-01?user_id=user-123"

# 4. Generate a calculator tool
curl -X POST http://localhost:8080/api/tools/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "tool_type": "calculator",
    "context": "Quadratic equations",
    "requirements": "Solve ax^2 + bx + c = 0 with step-by-step solution"
  }'

# Response: { "tool_id": "tool-789", "component_code": "...", ... }

# 5. Chat with AI
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "message": "I am struggling with derivatives",
    "context": {
      "current_plan": "plan-456",
      "current_subject": "Mathematics"
    }
  }'

# Response: { "response": "Let me help you...", ... }
```

## WebSocket Support (Future)

For real-time features like live AI editing and progress updates:

```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8080/ws');

// Subscribe to plan updates
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: 'plan_updates',
  user_id: 'user-123'
}));

// Receive updates
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  // Handle update
};
```
