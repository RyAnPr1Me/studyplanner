use chrono::{Datelike, Duration, Utc};
use uuid::Uuid;

use crate::models::plan::{DailyPlan, Plan, PlanGenerateRequest, Task, WeeklyPlan};

pub struct PlanService;

impl PlanService {
    pub fn generate_plan(request: &PlanGenerateRequest) -> Plan {
        let start_date = request.start_date.clone();
        let base_date = chrono::NaiveDate::parse_from_str(&request.start_date, "%Y-%m-%d")
            .unwrap_or_else(|_| Utc::now().date_naive());
        let subjects = request.subjects.clone();
        let mut daily_plans = Vec::new();

        let fallback_subject = "General".to_string();
        for index in 0..7 {
            let task_id = Uuid::new_v4();
            let subject = if subjects.is_empty() {
                fallback_subject.clone()
            } else {
                subjects
                    .get(index % subjects.len())
                    .cloned()
                    .unwrap_or_else(|| fallback_subject.clone())
            };
            let date = base_date + Duration::days(index as i64);
            let day = date.weekday().to_string();
            let date_str = date.format("%Y-%m-%d").to_string();
            let task = Task {
                id: task_id,
                subject: subject.clone(),
                topic: format!("{} practice", subject),
                duration_minutes: 90,
                start_time: "09:00".to_string(),
                due_date: date_str.clone(),
                priority: "high".to_string(),
                resources: vec!["Core textbook".to_string()],
                ai_notes: "Stay focused on fundamentals.".to_string(),
            };

            daily_plans.push(DailyPlan {
                date: date_str,
                day,
                tasks: vec![task],
                total_study_time: 240,
                breaks: vec!["11:00".to_string(), "15:00".to_string()],
            });
        }

        let week_end = base_date + Duration::days(6);

        Plan {
            plan_id: Uuid::new_v4(),
            user_id: request.user_id,
            weekly_plan: WeeklyPlan {
                week_start: start_date,
                week_end: week_end.format("%Y-%m-%d").to_string(),
                subjects,
                daily_plans,
            },
            ai_rationale: "Plan focuses on consistent daily progress.".to_string(),
            generated_at: Utc::now(),
        }
    }
}
