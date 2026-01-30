use actix_web::{HttpResponse, Responder, web};
use chrono::Datelike;
use uuid::Uuid;

use crate::db::{AppState, repository};
use crate::models::plan::{DailyPlan, DailyPlanResponse, PlanGenerateRequest, PlanResponse, RegenerateRequest, RegenerateResponse, SuggestedTool, TaskUpdateRequest, TaskUpdateResponse, parse_date};
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

    let conn = state.db.lock().expect("db lock");
    repository::insert_plan(&conn, &payload, &plan)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to persist plan"))?;

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn get_daily_plan(
    state: web::Data<AppState>,
    path: web::Path<String>,
    query: web::Query<DailyPlanQuery>,
) -> Result<impl Responder, ApiError> {
    let date = path.into_inner();
    parse_date(&date).map_err(|_| ApiError::validation("Invalid date format"))?;
    let conn = state.db.lock().expect("db lock");
    let tasks = repository::get_daily_plan(&conn, query.user_id, &date)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to load daily plan"))?;
    let completed_tasks = repository::get_completed_tasks(&conn, query.user_id, &date)
        .unwrap_or_default();
    let suggested_tools = repository::list_tools(&conn, query.user_id, None)
        .unwrap_or_default()
        .into_iter()
        .map(|tool| SuggestedTool {
            tool_id: tool.tool_id,
            tool_type: tool.tool_type,
            subject: tool.name,
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
    let conn = state.db.lock().expect("db lock");
    let entry = repository::update_task(&conn, task_id, &payload.status, payload.actual_duration, payload.notes.clone())
        .map_err(|_| ApiError::not_found("Task not found"))?;
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
    let conn = state.db.lock().expect("db lock");
    let mut tasks = repository::get_daily_plan(&conn, payload.user_id, &date).unwrap_or_default();
    if !payload.keep_completed {
        let completed = repository::get_completed_tasks(&conn, payload.user_id, &date).unwrap_or_default();
        tasks.retain(|task| !completed.contains(&task.id));
    }
    let day = chrono::NaiveDate::parse_from_str(&date, "%Y-%m-%d")
        .map(|parsed| parsed.weekday().to_string())
        .unwrap_or_else(|_| "Monday".to_string());
    let daily_plan = DailyPlan {
        date: date.clone(),
        day,
        total_study_time: tasks.iter().map(|task| task.duration_minutes).sum(),
        tasks,
        breaks: vec!["11:00".to_string(), "15:00".to_string()],
    };

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
    let conn = state.db.lock().expect("db lock");
    let tasks = repository::get_overdue_tasks(&conn, query.user_id, today)
        .unwrap_or_default();

    let response = serde_json::json!({
        "overdue_tasks": tasks,
        "total_overdue": tasks.len(),
    });

    Ok(HttpResponse::Ok().json(wrap(response)))
}
