use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlanGenerateRequest {
    pub user_id: Uuid,
    pub subjects: Vec<String>,
    pub goals: String,
    pub study_hours_per_day: u32,
    pub difficulty_level: String,
    pub start_date: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: Uuid,
    pub subject: String,
    pub topic: String,
    pub duration_minutes: u32,
    pub start_time: String,
    pub due_date: String,
    pub priority: String,
    pub resources: Vec<String>,
    pub ai_notes: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DailyPlan {
    pub date: String,
    pub day: String,
    pub tasks: Vec<Task>,
    pub total_study_time: u32,
    pub breaks: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeeklyPlan {
    pub week_start: String,
    pub week_end: String,
    pub subjects: Vec<String>,
    pub daily_plans: Vec<DailyPlan>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Plan {
    pub plan_id: Uuid,
    pub user_id: Uuid,
    pub weekly_plan: WeeklyPlan,
    pub ai_rationale: String,
    pub generated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PlanResponse {
    pub plan_id: Uuid,
    pub weekly_plan: WeeklyPlan,
    pub ai_rationale: String,
    pub generated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DailyPlanResponse {
    pub date: String,
    pub tasks: Vec<Task>,
    pub completed_tasks: Vec<Uuid>,
    pub suggested_tools: Vec<SuggestedTool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SuggestedTool {
    pub tool_id: Uuid,
    pub tool_type: String,
    pub subject: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskUpdateRequest {
    pub status: String,
    pub actual_duration: Option<u32>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskUpdateResponse {
    pub task_id: Uuid,
    pub status: String,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegenerateRequest {
    pub user_id: Uuid,
    pub adjustments: String,
    pub keep_completed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegenerateResponse {
    pub daily_plan: DailyPlan,
    pub changes: String,
}

#[derive(Debug, Clone)]
pub struct StoredTask {
    pub task: Task,
    pub status: String,
    pub actual_duration: Option<u32>,
    pub notes: Option<String>,
    pub updated_at: DateTime<Utc>,
    pub user_id: Uuid,
    pub plan_date: String,
}

pub fn parse_date(value: &str) -> Result<NaiveDate, chrono::ParseError> {
    NaiveDate::parse_from_str(value, "%Y-%m-%d")
}
