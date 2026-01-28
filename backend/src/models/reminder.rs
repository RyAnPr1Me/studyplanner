use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderCreateRequest {
    pub task_id: Uuid,
    pub reminder_time: DateTime<Utc>,
    pub message: String,
    pub notification_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderResponse {
    pub reminder_id: Uuid,
    pub task_id: Uuid,
    pub reminder_time: DateTime<Utc>,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderListQuery {
    pub user_id: Uuid,
    pub status: Option<String>,
    pub from_date: Option<String>,
    pub to_date: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderListItem {
    pub reminder_id: Uuid,
    pub task_id: Uuid,
    pub task_subject: String,
    pub task_topic: String,
    pub reminder_time: DateTime<Utc>,
    pub message: String,
    pub status: String,
    pub notification_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderListResponse {
    pub reminders: Vec<ReminderListItem>,
    pub total: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpcomingReminderItem {
    pub reminder_id: Uuid,
    pub task_id: Uuid,
    pub task_subject: String,
    pub reminder_time: DateTime<Utc>,
    pub message: String,
    pub time_until: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpcomingReminderResponse {
    pub upcoming_reminders: Vec<UpcomingReminderItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderUpdateRequest {
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderUpdateResponse {
    pub reminder_id: Uuid,
    pub status: String,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderDeleteResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Clone)]
pub struct Reminder {
    pub reminder_id: Uuid,
    pub user_id: Uuid,
    pub task_id: Uuid,
    pub reminder_time: DateTime<Utc>,
    pub message: String,
    pub notification_type: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}
