use std::collections::HashMap;
use std::sync::Mutex;

use uuid::Uuid;

use crate::models::{plan::{DailyPlan, Plan, StoredTask}, reminder::Reminder, tool::Tool, user::UserProfile};

pub mod repository;
pub mod schema;

pub struct AppState {
    pub plans: Mutex<HashMap<Uuid, Plan>>,
    pub daily_plans: Mutex<HashMap<String, DailyPlan>>,
    pub tasks: Mutex<HashMap<Uuid, StoredTask>>,
    pub tools: Mutex<HashMap<Uuid, Tool>>,
    pub reminders: Mutex<HashMap<Uuid, Reminder>>,
    pub users: Mutex<HashMap<Uuid, UserProfile>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            plans: Mutex::new(HashMap::new()),
            daily_plans: Mutex::new(HashMap::new()),
            tasks: Mutex::new(HashMap::new()),
            tools: Mutex::new(HashMap::new()),
            reminders: Mutex::new(HashMap::new()),
            users: Mutex::new(HashMap::new()),
        }
    }
}
