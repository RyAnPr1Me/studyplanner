use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::models::reminder::{Reminder, ReminderCreateRequest};

pub struct ReminderService;

impl ReminderService {
    pub fn create(user_id: Uuid, request: &ReminderCreateRequest) -> Reminder {
        Reminder {
            reminder_id: Uuid::new_v4(),
            user_id,
            task_id: request.task_id,
            reminder_time: request.reminder_time,
            message: request.message.clone(),
            notification_type: request.notification_type.clone(),
            status: "pending".to_string(),
            created_at: Utc::now(),
        }
    }

    pub fn is_future(time: DateTime<Utc>) -> bool {
        time > Utc::now()
    }
}
