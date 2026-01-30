use chrono::{DateTime, Utc};
use rusqlite::{Connection, OptionalExtension, Result, params};
use uuid::Uuid;

use crate::models::{
    ai::AiChatRequest,
    plan::{Plan, PlanGenerateRequest, StoredTask, Task},
    reminder::Reminder,
    tool::{Tool, ToolMetadata},
    user::{UserProfile, UserProfileRequest, UserStatsResponse, WeeklyActivity},
};

pub fn ensure_user(conn: &Connection, request: &UserProfileRequest) -> Result<UserProfile> {
    let mut stmt = conn.prepare("SELECT id, name, email, preferences_json FROM users WHERE email = ?1")?;
    let existing: Option<UserProfile> = stmt
        .query_row([&request.email], |row| {
            let prefs: Option<String> = row.get(3)?;
            Ok(UserProfile {
                user_id: Uuid::parse_str(&row.get::<_, String>(0)?).unwrap_or_else(|_| Uuid::new_v4()),
                name: row.get(1)?,
                email: row.get(2)?,
                preferences: prefs.and_then(|value| serde_json::from_str(&value).ok()),
            })
        })
        .optional()?;

    let user_id = existing.map(|user| user.user_id).unwrap_or_else(Uuid::new_v4);
    let prefs_json = request
        .preferences
        .as_ref()
        .and_then(|value| serde_json::to_string(value).ok());
    conn.execute(
        "INSERT INTO users (id, name, email, preferences_json) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, email = excluded.email, preferences_json = excluded.preferences_json",
        params![user_id.to_string(), request.name, request.email, prefs_json],
    )?;

    Ok(UserProfile {
        user_id,
        name: request.name.clone(),
        email: request.email.clone(),
        preferences: request.preferences.clone(),
    })
}

pub fn ensure_user_id(conn: &Connection, user_id: Uuid) -> Result<()> {
    conn.execute(
        "INSERT OR IGNORE INTO users (id, name) VALUES (?1, 'Anonymous')",
        params![user_id.to_string()],
    )?;
    Ok(())
}

pub fn insert_plan(conn: &Connection, request: &PlanGenerateRequest, plan: &Plan) -> Result<()> {
    ensure_user_id(conn, request.user_id)?;
    conn.execute(
        "INSERT INTO study_plans (id, user_id, plan_type, start_date, end_date, subjects_json, ai_rationale)
         VALUES (?1, ?2, 'weekly', ?3, ?4, ?5, ?6)",
        params![
            plan.plan_id.to_string(),
            request.user_id.to_string(),
            plan.weekly_plan.week_start,
            plan.weekly_plan.week_end,
            serde_json::to_string(&plan.weekly_plan.subjects).unwrap_or_default(),
            plan.ai_rationale
        ],
    )?;

    for daily in &plan.weekly_plan.daily_plans {
        for task in &daily.tasks {
            conn.execute(
                "INSERT INTO tasks (id, plan_id, date, subject, topic, duration_minutes, start_time, due_date, priority, status, resources_json, ai_notes)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'pending', ?10, ?11)",
                params![
                    task.id.to_string(),
                    plan.plan_id.to_string(),
                    daily.date,
                    task.subject,
                    task.topic,
                    task.duration_minutes,
                    task.start_time,
                    task.due_date,
                    task.priority,
                    serde_json::to_string(&task.resources).unwrap_or_default(),
                    task.ai_notes
                ],
            )?;
        }
    }
    Ok(())
}

pub fn get_daily_plan(conn: &Connection, user_id: Uuid, date: &str) -> Result<Vec<Task>> {
    let mut stmt = conn.prepare(
        "SELECT t.id, t.subject, t.topic, t.duration_minutes, t.start_time, t.due_date, t.priority, t.resources_json, t.ai_notes
         FROM tasks t JOIN study_plans p ON t.plan_id = p.id
         WHERE p.user_id = ?1 AND t.date = ?2",
    )?;
    let rows = stmt.query_map(params![user_id.to_string(), date], |row| {
        let resources: String = row.get(7)?;
        Ok(Task {
            id: Uuid::parse_str(&row.get::<_, String>(0)?).unwrap_or_else(|_| Uuid::new_v4()),
            subject: row.get(1)?,
            topic: row.get(2)?,
            duration_minutes: row.get(3)?,
            start_time: row.get(4)?,
            due_date: row.get(5)?,
            priority: row.get(6)?,
            resources: serde_json::from_str(&resources).unwrap_or_default(),
            ai_notes: row.get(8)?,
        })
    })?;
    let mut tasks = Vec::new();
    for row in rows {
        tasks.push(row?);
    }
    Ok(tasks)
}

pub fn get_completed_tasks(conn: &Connection, user_id: Uuid, date: &str) -> Result<Vec<Uuid>> {
    let mut stmt = conn.prepare(
        "SELECT t.id FROM tasks t JOIN study_plans p ON t.plan_id = p.id
         WHERE p.user_id = ?1 AND t.date = ?2 AND t.status = 'completed'",
    )?;
    let rows = stmt.query_map(params![user_id.to_string(), date], |row| {
        let id: String = row.get(0)?;
        Ok(Uuid::parse_str(&id).unwrap_or_else(|_| Uuid::new_v4()))
    })?;
    let mut ids = Vec::new();
    for row in rows {
        ids.push(row?);
    }
    Ok(ids)
}

pub fn get_task_user_id(conn: &Connection, task_id: Uuid) -> Result<Option<Uuid>> {
    let mut stmt = conn.prepare(
        "SELECT p.user_id FROM tasks t JOIN study_plans p ON t.plan_id = p.id WHERE t.id = ?1",
    )?;
    let user_id = stmt
        .query_row([task_id.to_string()], |row| {
            let id: String = row.get(0)?;
            Ok(Uuid::parse_str(&id).unwrap_or_else(|_| Uuid::new_v4()))
        })
        .optional()?;
    Ok(user_id)
}

pub fn get_overdue_tasks(conn: &Connection, user_id: Uuid, today: chrono::NaiveDate) -> Result<Vec<serde_json::Value>> {
    let mut stmt = conn.prepare(
        "SELECT t.id, t.subject, t.topic, t.due_date, t.priority, t.status
         FROM tasks t JOIN study_plans p ON t.plan_id = p.id
         WHERE p.user_id = ?1 AND t.due_date IS NOT NULL AND t.status != 'completed'",
    )?;
    let rows = stmt.query_map([user_id.to_string()], |row| {
        let due_date: String = row.get(3)?;
        let due = chrono::NaiveDate::parse_from_str(&due_date, "%Y-%m-%d").ok();
        Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?, row.get::<_, String>(2)?, due_date, row.get::<_, String>(4)?, row.get::<_, String>(5)?, due))
    })?;
    let mut overdue = Vec::new();
    for row in rows {
        let (id, subject, topic, due_date, priority, status, parsed) = row?;
        if let Some(due) = parsed {
            if due < today {
                overdue.push(serde_json::json!({
                    "task_id": id,
                    "subject": subject,
                    "topic": topic,
                    "due_date": due_date,
                    "days_overdue": (today - due).num_days(),
                    "priority": priority,
                    "status": status,
                }));
            }
        }
    }
    Ok(overdue)
}

pub fn update_task(conn: &Connection, task_id: Uuid, status: &str, actual_duration: Option<u32>, notes: Option<String>) -> Result<StoredTask> {
    if !matches!(status, "pending" | "in_progress" | "completed" | "skipped") {
        return Err(rusqlite::Error::InvalidParameterName("status".to_string()));
    }
    let completed_at = if status == "completed" { Some(Utc::now().to_rfc3339()) } else { None };
    conn.execute(
        "UPDATE tasks SET status = ?1, actual_duration = ?2, user_notes = ?3, completed_at = ?4 WHERE id = ?5",
        params![status, actual_duration, notes, completed_at, task_id.to_string()],
    )?;
    let mut stmt = conn.prepare(
        "SELECT t.subject, t.topic, t.duration_minutes, t.start_time, t.due_date, t.priority, t.resources_json, t.ai_notes, t.status, t.actual_duration, t.user_notes, p.user_id, t.date
         FROM tasks t JOIN study_plans p ON t.plan_id = p.id WHERE t.id = ?1",
    )?;
    let stored = stmt.query_row([task_id.to_string()], |row| {
        let resources: String = row.get(6)?;
        Ok(StoredTask {
            task: Task {
                id: task_id,
                subject: row.get(0)?,
                topic: row.get(1)?,
                duration_minutes: row.get(2)?,
                start_time: row.get(3)?,
                due_date: row.get(4)?,
                priority: row.get(5)?,
                resources: serde_json::from_str(&resources).unwrap_or_default(),
                ai_notes: row.get(7)?,
            },
            status: row.get(8)?,
            actual_duration: row.get::<_, Option<u32>>(9)?,
            notes: row.get(10)?,
            updated_at: Utc::now(),
            user_id: Uuid::parse_str(&row.get::<_, String>(11)?).unwrap_or_else(|_| Uuid::new_v4()),
            plan_date: row.get(12)?,
        })
    })?;
    Ok(stored)
}

pub fn list_tools(conn: &Connection, user_id: Uuid, tool_type: Option<&str>) -> Result<Vec<Tool>> {
    let mut query = String::from("SELECT id, user_id, name, tool_type, description, component_code, metadata_json, version, usage_count, last_used FROM tools WHERE user_id = ?1");
    if tool_type.is_some() {
        query.push_str(" AND tool_type = ?2");
    }
    let mut stmt = conn.prepare(&query)?;
    let rows = if let Some(tool_type) = tool_type {
        stmt.query_map(params![user_id.to_string(), tool_type], map_tool)?
    } else {
        stmt.query_map([user_id.to_string()], map_tool)?
    };
    let mut tools = Vec::new();
    for row in rows {
        tools.push(row?);
    }
    Ok(tools)
}

fn map_tool(row: &rusqlite::Row<'_>) -> Result<Tool> {
    let metadata_json: String = row.get(6)?;
    let metadata: ToolMetadata = serde_json::from_str(&metadata_json).unwrap_or(ToolMetadata {
        version: row.get(7)?,
        created_at: DateTime::parse_from_rfc3339("2026-01-01T00:00:00Z").unwrap().with_timezone(&Utc),
        ai_model: "local".to_string(),
    });
    Ok(Tool {
        tool_id: Uuid::parse_str(&row.get::<_, String>(0)?).unwrap_or_else(|_| Uuid::new_v4()),
        user_id: Uuid::parse_str(&row.get::<_, String>(1)?).unwrap_or_else(|_| Uuid::new_v4()),
        name: row.get(2)?,
        tool_type: row.get(3)?,
        description: row.get(4)?,
        component_code: row.get(5)?,
        metadata,
        usage_count: row.get::<_, u32>(8)?,
        last_used: row.get::<_, Option<String>>(9)?.and_then(|value| DateTime::parse_from_rfc3339(&value).ok()).map(|dt| dt.with_timezone(&Utc)),
    })
}

pub fn insert_tool(conn: &Connection, tool: &Tool) -> Result<()> {
    ensure_user_id(conn, tool.user_id)?;
    conn.execute(
        "INSERT INTO tools (id, user_id, name, tool_type, description, component_code, metadata_json, version, usage_count, last_used)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            tool.tool_id.to_string(),
            tool.user_id.to_string(),
            tool.name,
            tool.tool_type,
            tool.description,
            tool.component_code,
            serde_json::to_string(&tool.metadata).unwrap_or_default(),
            tool.metadata.version,
            tool.usage_count,
            tool.last_used.map(|dt| dt.to_rfc3339()),
        ],
    )?;
    Ok(())
}

pub fn update_tool(conn: &Connection, tool_id: Uuid, component_code: &str, version: &str) -> Result<()> {
    conn.execute(
        "UPDATE tools SET component_code = ?1, version = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?3",
        params![component_code, version, tool_id.to_string()],
    )?;
    Ok(())
}

pub fn get_tool(conn: &Connection, tool_id: Uuid) -> Result<Option<Tool>> {
    let mut stmt = conn.prepare("SELECT id, user_id, name, tool_type, description, component_code, metadata_json, version, usage_count, last_used FROM tools WHERE id = ?1")?;
    stmt.query_row([tool_id.to_string()], map_tool).optional()
}

pub fn delete_tool(conn: &Connection, tool_id: Uuid) -> Result<bool> {
    let rows = conn.execute("DELETE FROM tools WHERE id = ?1", [tool_id.to_string()])?;
    Ok(rows > 0)
}

pub fn insert_conversation(conn: &Connection, request: &AiChatRequest, response: &str) -> Result<Uuid> {
    let convo_id = Uuid::new_v4();
    ensure_user_id(conn, request.user_id)?;
    conn.execute(
        "INSERT INTO ai_conversations (id, user_id, message, response, context_json) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            convo_id.to_string(),
            request.user_id.to_string(),
            request.message,
            response,
            request.context.as_ref().and_then(|ctx| serde_json::to_string(ctx).ok()),
        ],
    )?;
    Ok(convo_id)
}

pub fn insert_reminder(conn: &Connection, reminder: &Reminder) -> Result<()> {
    conn.execute(
        "INSERT INTO reminders (id, task_id, user_id, reminder_time, message, status, notification_type, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![
            reminder.reminder_id.to_string(),
            reminder.task_id.to_string(),
            reminder.user_id.to_string(),
            reminder.reminder_time.to_rfc3339(),
            reminder.message,
            reminder.status,
            reminder.notification_type,
            reminder.created_at.to_rfc3339(),
        ],
    )?;
    Ok(())
}

pub fn list_reminders(conn: &Connection, user_id: Uuid, status: Option<&str>) -> Result<Vec<Reminder>> {
    let mut query = String::from("SELECT id, task_id, user_id, reminder_time, message, status, notification_type, created_at FROM reminders WHERE user_id = ?1");
    if status.is_some() {
        query.push_str(" AND status = ?2");
    }
    let mut stmt = conn.prepare(&query)?;
    let rows = if let Some(status) = status {
        stmt.query_map(params![user_id.to_string(), status], map_reminder)?
    } else {
        stmt.query_map([user_id.to_string()], map_reminder)?
    };
    let mut reminders = Vec::new();
    for row in rows {
        reminders.push(row?);
    }
    Ok(reminders)
}

pub fn get_user_profile(conn: &Connection, user_id: Uuid) -> Result<Option<UserProfile>> {
    let mut stmt = conn.prepare("SELECT id, name, email, preferences_json FROM users WHERE id = ?1")?;
    stmt.query_row([user_id.to_string()], |row| {
        let prefs: Option<String> = row.get(3)?;
        Ok(UserProfile {
            user_id,
            name: row.get(1)?,
            email: row.get(2)?,
            preferences: prefs.and_then(|value| serde_json::from_str(&value).ok()),
        })
    }).optional()
}

pub fn get_reminder(conn: &Connection, reminder_id: Uuid) -> Result<Option<Reminder>> {
    let mut stmt = conn.prepare("SELECT id, task_id, user_id, reminder_time, message, status, notification_type, created_at FROM reminders WHERE id = ?1")?;
    stmt.query_row([reminder_id.to_string()], map_reminder).optional()
}

fn map_reminder(row: &rusqlite::Row<'_>) -> Result<Reminder> {
    Ok(Reminder {
        reminder_id: Uuid::parse_str(&row.get::<_, String>(0)?).unwrap_or_else(|_| Uuid::new_v4()),
        task_id: Uuid::parse_str(&row.get::<_, String>(1)?).unwrap_or_else(|_| Uuid::new_v4()),
        user_id: Uuid::parse_str(&row.get::<_, String>(2)?).unwrap_or_else(|_| Uuid::new_v4()),
        reminder_time: DateTime::parse_from_rfc3339(&row.get::<_, String>(3)?)
            .unwrap_or_else(|_| Utc::now().into())
            .with_timezone(&Utc),
        message: row.get(4)?,
        status: row.get(5)?,
        notification_type: row.get(6)?,
        created_at: DateTime::parse_from_rfc3339(&row.get::<_, String>(7)?)
            .unwrap_or_else(|_| Utc::now().into())
            .with_timezone(&Utc),
    })
}

pub fn update_reminder_status(conn: &Connection, reminder_id: Uuid, status: &str) -> Result<bool> {
    if !matches!(status, "pending" | "sent" | "dismissed") {
        return Err(rusqlite::Error::InvalidParameterName("status".to_string()));
    }
    let rows = conn.execute("UPDATE reminders SET status = ?1 WHERE id = ?2", params![status, reminder_id.to_string()])?;
    Ok(rows > 0)
}

pub fn delete_reminder(conn: &Connection, reminder_id: Uuid) -> Result<bool> {
    let rows = conn.execute("DELETE FROM reminders WHERE id = ?1", [reminder_id.to_string()])?;
    Ok(rows > 0)
}

pub fn get_user_stats(conn: &Connection, user_id: Uuid) -> Result<UserStatsResponse> {
    let total_hours: f64 = conn
        .query_row("SELECT COALESCE(SUM(actual_duration), 0) FROM tasks t JOIN study_plans p ON t.plan_id = p.id WHERE p.user_id = ?1", [user_id.to_string()], |row| row.get(0))
        .unwrap_or(0.0);
    let completed_tasks: u32 = conn
        .query_row("SELECT COUNT(*) FROM tasks t JOIN study_plans p ON t.plan_id = p.id WHERE p.user_id = ?1 AND t.status = 'completed'", [user_id.to_string()], |row| row.get(0))
        .unwrap_or(0);
    let tools_created: u32 = conn
        .query_row("SELECT COUNT(*) FROM tools WHERE user_id = ?1", [user_id.to_string()], |row| row.get(0))
        .unwrap_or(0);
    let ai_interactions: u32 = conn
        .query_row("SELECT COUNT(*) FROM ai_conversations WHERE user_id = ?1", [user_id.to_string()], |row| row.get(0))
        .unwrap_or(0);

    let mut activity_stmt = conn.prepare(
        "SELECT date, COALESCE(SUM(actual_duration), 0) as minutes
         FROM tasks t JOIN study_plans p ON t.plan_id = p.id
         WHERE p.user_id = ?1
         GROUP BY date
         ORDER BY date DESC
         LIMIT 7",
    )?;
    let activity_rows = activity_stmt.query_map([user_id.to_string()], |row| {
        Ok(WeeklyActivity {
            date: row.get(0)?,
            hours: row.get::<_, f64>(1)? / 60.0,
        })
    })?;
    let mut weekly_activity = Vec::new();
    for row in activity_rows {
        weekly_activity.push(row?);
    }
    Ok(UserStatsResponse {
        total_study_hours: total_hours / 60.0,
        completed_tasks,
        current_streak: 0,
        tools_created,
        ai_interactions,
        subjects_progress: get_subject_progress(conn, user_id).unwrap_or_else(|_| serde_json::json!({})),
        weekly_activity,
    })
}

fn get_subject_progress(conn: &Connection, user_id: Uuid) -> Result<serde_json::Value> {
    let mut stmt = conn.prepare(
        "SELECT subject, COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
         FROM tasks t JOIN study_plans p ON t.plan_id = p.id
         WHERE p.user_id = ?1
         GROUP BY subject",
    )?;
    let rows = stmt.query_map([user_id.to_string()], |row| {
        let subject: String = row.get(0)?;
        let total: f64 = row.get::<_, f64>(1)?;
        let completed: f64 = row.get::<_, f64>(2)?;
        let percent = if total > 0.0 { (completed / total) * 100.0 } else { 0.0 };
        Ok((subject, percent))
    })?;
    let mut map = serde_json::Map::new();
    for row in rows {
        let (subject, percent) = row?;
        map.insert(subject, serde_json::json!(percent.round() as u32));
    }
    Ok(serde_json::Value::Object(map))
}
