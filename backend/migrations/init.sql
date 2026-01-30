-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    preferences_json TEXT
);

-- Study plans table
CREATE TABLE IF NOT EXISTS study_plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    plan_type TEXT CHECK(plan_type IN ('weekly', 'daily')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    subjects_json TEXT,
    ai_rationale TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    plan_id TEXT NOT NULL,
    date TEXT NOT NULL,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    start_time TEXT,
    due_date TEXT,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'completed', 'skipped')),
    resources_json TEXT,
    ai_notes TEXT,
    actual_duration INTEGER,
    user_notes TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE CASCADE
);

-- Dynamic tools table
CREATE TABLE IF NOT EXISTS tools (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    tool_type TEXT NOT NULL CHECK(tool_type IN ('calculator', 'timer', 'flashcard', 'custom')),
    description TEXT,
    component_code TEXT NOT NULL,
    metadata_json TEXT,
    version TEXT DEFAULT '1.0.0',
    usage_count INTEGER DEFAULT 0,
    last_used TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context_json TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User statistics table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,
    total_study_hours REAL DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    tools_created INTEGER DEFAULT 0,
    ai_interactions INTEGER DEFAULT 0,
    last_activity TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    reminder_time TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'dismissed')),
    notification_type TEXT DEFAULT 'system' CHECK(notification_type IN ('system', 'email', 'both')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    sent_at TEXT,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_plan_date ON tasks(plan_id, date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tools_user_type ON tools(user_id, tool_type);
CREATE INDEX IF NOT EXISTS idx_plans_user_date ON study_plans(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_reminders_user_time ON reminders(user_id, reminder_time);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
