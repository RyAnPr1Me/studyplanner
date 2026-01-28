use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfileRequest {
    pub name: String,
    pub email: Option<String>,
    pub preferences: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfileResponse {
    pub user_id: Uuid,
    pub profile: UserProfile,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub user_id: Uuid,
    pub name: String,
    pub email: Option<String>,
    pub preferences: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserStatsResponse {
    pub total_study_hours: f64,
    pub completed_tasks: u32,
    pub current_streak: u32,
    pub tools_created: u32,
    pub ai_interactions: u32,
    pub subjects_progress: serde_json::Value,
    pub weekly_activity: Vec<WeeklyActivity>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WeeklyActivity {
    pub date: String,
    pub hours: f64,
}
