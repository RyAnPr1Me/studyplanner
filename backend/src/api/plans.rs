use actix_web::{HttpResponse, Responder, web};
use uuid::Uuid;

use crate::db::AppState;
use crate::models::plan::{DailyPlanResponse, PlanGenerateRequest, PlanResponse, RegenerateRequest, RegenerateResponse, SuggestedTool, TaskUpdateRequest, TaskUpdateResponse, parse_date};
use crate::services::plan_service::PlanService;
use crate::utils::{errors::ApiError, response::wrap};

#[derive(serde::Deserialize)]
struct DailyPlanQuery {
    user_id: Uuid,
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/generate").route(web::post().to(generate_plan)))
        .service(web::resource("/daily/{date}").route(web::get().to(get_daily_plan)))
        .service(web::resource("/daily/{date}/regenerate").route(web::post().to(regenerate_daily)))
        .service(web::resource("/tasks/{task_id}").route(web::patch().to(update_task)));
}

pub fn configure_task_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/overdue").route(web::get().to(get_overdue_tasks)));
}

async fn generate_plan(
    state: web::Data<AppState>,
    payload: web::Json<PlanGenerateRequest>,
) -> Result<impl Responder, ApiError> {
    let plan = PlanService::generate_plan(&payload);
    let response = PlanResponse {
        plan_id: plan.plan_id,
        weekly_plan: plan.weekly_plan.clone(),
        ai_rationale: plan.ai_rationale.clone(),
        generated_at: plan.generated_at,
    };

    state.plans.lock().expect("plans lock").insert(plan.plan_id, plan.clone());
    let mut tasks = state.tasks.lock().expect("tasks lock");
    for daily in &plan.weekly_plan.daily_plans {
        for task in &daily.tasks {
            tasks.insert(
                task.id,
                crate::models::plan::StoredTask {
                    task: task.clone(),
                    status: "pending".to_string(),
                    actual_duration: None,
                    notes: None,
                    updated_at: plan.generated_at,
                    user_id: plan.user_id,
                    plan_date: daily.date.clone(),
                },
            );
        }
        state.daily_plans.lock().expect("daily lock").insert(daily.date.clone(), daily.clone());
    }

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn get_daily_plan(
    state: web::Data<AppState>,
    path: web::Path<String>,
    query: web::Query<DailyPlanQuery>,
) -> Result<impl Responder, ApiError> {
    let date = path.into_inner();
    parse_date(&date).map_err(|_| ApiError::validation("Invalid date format"))?;

    let daily = state.daily_plans.lock().expect("daily lock").get(&date).cloned();
    let tasks = match daily {
        Some(plan) => plan.tasks,
        None => Vec::new(),
    };

    let completed_tasks = state
        .tasks
        .lock()
        .expect("tasks lock")
        .values()
        .filter(|stored| stored.user_id == query.user_id && stored.plan_date == date && stored.status == "completed")
        .map(|stored| stored.task.id)
        .collect::<Vec<_>>();

    let suggested_tools = state
        .tools
        .lock()
        .expect("tools lock")
        .values()
        .filter(|tool| tool.user_id == query.user_id)
        .map(|tool| SuggestedTool {
            tool_id: tool.tool_id,
            tool_type: tool.tool_type.clone(),
            subject: tool.name.clone(),
        })
        .collect();

    let response = DailyPlanResponse {
        date,
        tasks,
        completed_tasks,
        suggested_tools,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn update_task(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    payload: web::Json<TaskUpdateRequest>,
) -> Result<impl Responder, ApiError> {
    let task_id = path.into_inner();
    let mut tasks = state.tasks.lock().expect("tasks lock");
    let entry = tasks.get_mut(&task_id).ok_or_else(|| ApiError::not_found("Task not found"))?;
    entry.status = payload.status.clone();
    entry.actual_duration = payload.actual_duration;
    entry.notes = payload.notes.clone();
    entry.updated_at = chrono::Utc::now();

    let response = TaskUpdateResponse {
        task_id,
        status: entry.status.clone(),
        updated_at: entry.updated_at,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn regenerate_daily(
    state: web::Data<AppState>,
    path: web::Path<String>,
    payload: web::Json<RegenerateRequest>,
) -> Result<impl Responder, ApiError> {
    let date = path.into_inner();
    parse_date(&date).map_err(|_| ApiError::validation("Invalid date format"))?;
    let daily = state.daily_plans.lock().expect("daily lock").get(&date).cloned();
    let mut daily_plan = daily.unwrap_or_else(|| crate::models::plan::DailyPlan {
        date: date.clone(),
        day: "Monday".to_string(),
        tasks: Vec::new(),
        total_study_time: 0,
        breaks: Vec::new(),
    });

    if !payload.keep_completed {
        let tasks = state.tasks.lock().expect("tasks lock");
        daily_plan.tasks.retain(|task| {
            tasks
                .get(&task.id)
                .map(|stored| stored.status != "completed")
                .unwrap_or(true)
        });
    }

    let response = RegenerateResponse {
        daily_plan,
        changes: format!("Applied adjustments: {}", payload.adjustments),
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn get_overdue_tasks(
    state: web::Data<AppState>,
    query: web::Query<DailyPlanQuery>,
) -> Result<impl Responder, ApiError> {
    let today = chrono::Utc::now().date_naive();
    let tasks = state
        .tasks
        .lock()
        .expect("tasks lock")
        .values()
        .filter(|stored| stored.user_id == query.user_id)
        .filter_map(|stored| {
            let due = chrono::NaiveDate::parse_from_str(&stored.task.due_date, "%Y-%m-%d").ok()?;
            if due < today && stored.status != "completed" {
                let days_overdue = (today - due).num_days();
                Some(serde_json::json!({
                    "task_id": stored.task.id,
                    "subject": stored.task.subject,
                    "topic": stored.task.topic,
                    "due_date": stored.task.due_date,
                    "days_overdue": days_overdue,
                    "priority": stored.task.priority,
                    "status": stored.status,
                }))
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    let response = serde_json::json!({
        "overdue_tasks": tasks,
        "total_overdue": tasks.len(),
    });

    Ok(HttpResponse::Ok().json(wrap(response)))
}
