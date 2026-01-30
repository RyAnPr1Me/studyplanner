use chrono::{Datelike, Duration, NaiveDate, Utc};
use uuid::Uuid;

use crate::models::plan::{DailyPlan, Plan, PlanGenerateRequest, Task, WeeklyPlan};

pub struct PlanService;

impl PlanService {
    pub fn generate_plan(request: &PlanGenerateRequest) -> Plan {
        let start_date = request.start_date.clone();
        let base_date = NaiveDate::parse_from_str(&request.start_date, "%Y-%m-%d")
            .unwrap_or_else(|_| Utc::now().date_naive());
        let subjects = request.subjects.clone();
        let mut daily_plans = Vec::new();

        let fallback_subject = "General".to_string();
        let minutes_per_day = request.study_hours_per_day.saturating_mul(60).max(60);
        let sessions_per_day = 3_u32;
        for index in 0..7 {
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
            let session_minutes = (minutes_per_day / sessions_per_day).max(30);
            let mut tasks = Vec::new();
            for session_index in 0..sessions_per_day {
                let task_id = Uuid::new_v4();
                let start_hour = 9 + (session_index as i32 * 3);
                let start_time = format!("{:02}:00", start_hour.clamp(6, 21));
                tasks.push(Task {
                    id: task_id,
                    subject: subject.clone(),
                    topic: format!("{} - session {}", subject, session_index + 1),
                    duration_minutes: session_minutes,
                    start_time,
                    due_date: date_str.clone(),
                    priority: if session_index == 0 { "high" } else { "medium" }.to_string(),
                    resources: vec![
                        "Core textbook".to_string(),
                        format!("{} practice set {}", subject, session_index + 1),
                    ],
                    ai_notes: format!("Focus on {} fundamentals.", subject),
                });
            }

            daily_plans.push(DailyPlan {
                date: date_str,
                day,
                tasks,
                total_study_time: minutes_per_day,
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
