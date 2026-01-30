use actix_web::{HttpResponse, Responder, web};
use chrono::Utc;
use uuid::Uuid;

use crate::db::{AppState, repository};
use crate::models::reminder::{
    ReminderCreateRequest, ReminderDeleteResponse, ReminderListQuery, ReminderListResponse, ReminderListItem,
    ReminderUpdateRequest, ReminderUpdateResponse, UpcomingReminderItem, UpcomingReminderResponse,
};
use crate::models::plan::parse_date;
use crate::services::reminder_service::ReminderService;
use crate::utils::{errors::ApiError, response::wrap};

#[derive(serde::Deserialize)]
struct UpcomingQuery {
    user_id: Uuid,
    hours: Option<i64>,
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/create").route(web::post().to(create_reminder)))
        .service(web::resource("").route(web::get().to(list_reminders)))
        .service(web::resource("/upcoming").route(web::get().to(list_upcoming)))
        .service(web::resource("/{reminder_id}").route(web::patch().to(update_reminder)).route(web::delete().to(delete_reminder)));
}

async fn create_reminder(
    state: web::Data<AppState>,
    payload: web::Json<ReminderCreateRequest>,
) -> Result<impl Responder, ApiError> {
    let conn = state.db.lock().expect("db lock");
    let user_id = repository::get_task_user_id(&conn, payload.task_id)
        .map_err(|_| ApiError::validation("Invalid task_id"))?
        .ok_or_else(|| ApiError::validation("Task not found"))?;
    if !ReminderService::is_future(payload.reminder_time) {
        return Err(ApiError::validation("reminder_time must be in the future"));
    }
    let reminder = ReminderService::create(user_id, &payload);
    repository::ensure_user_id(&conn, user_id)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to ensure user"))?;
    repository::insert_reminder(&conn, &reminder)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to create reminder"))?;

    let response = crate::models::reminder::ReminderResponse {
        reminder_id: reminder.reminder_id,
        task_id: reminder.task_id,
        user_id: reminder.user_id,
        reminder_time: reminder.reminder_time,
        status: reminder.status,
        created_at: reminder.created_at,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn list_reminders(
    state: web::Data<AppState>,
    query: web::Query<ReminderListQuery>,
) -> Result<impl Responder, ApiError> {
    let conn = state.db.lock().expect("db lock");
    let reminders = repository::list_reminders(&conn, query.user_id, query.status.as_deref())
        .unwrap_or_default()
        .into_iter()
        .filter(|reminder| {
            let within_from = query.from_date.as_ref().map(|date| {
                parse_date(date)
                    .map(|from| reminder.reminder_time.date_naive() >= from)
                    .unwrap_or(true)
            }).unwrap_or(true);
            let within_to = query.to_date.as_ref().map(|date| {
                parse_date(date)
                    .map(|to| reminder.reminder_time.date_naive() <= to)
                    .unwrap_or(true)
            }).unwrap_or(true);
            within_from && within_to
        })
        .map(|reminder| ReminderListItem {
            reminder_id: reminder.reminder_id,
            task_id: reminder.task_id,
            task_subject: "General".to_string(),
            task_topic: "Study task".to_string(),
            reminder_time: reminder.reminder_time,
            message: reminder.message.clone(),
            status: reminder.status.clone(),
            notification_type: reminder.notification_type.clone(),
        })
        .collect::<Vec<_>>();

    let total = reminders.len();
    let response = ReminderListResponse {
        total,
        reminders,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn list_upcoming(
    state: web::Data<AppState>,
    query: web::Query<UpcomingQuery>,
) -> Result<impl Responder, ApiError> {
    let now = Utc::now();
    let window = now + chrono::Duration::hours(query.hours.unwrap_or(24));
    let conn = state.db.lock().expect("db lock");
    let reminders = repository::list_reminders(&conn, query.user_id, None)
        .unwrap_or_default()
        .into_iter()
        .filter(|reminder| reminder.reminder_time >= now && reminder.reminder_time <= window)
        .map(|reminder| {
            let duration = reminder.reminder_time - now;
            UpcomingReminderItem {
                reminder_id: reminder.reminder_id,
                task_id: reminder.task_id,
                task_subject: "General".to_string(),
                reminder_time: reminder.reminder_time,
                message: reminder.message.clone(),
                time_until: format!("{} minutes", duration.num_minutes()),
            }
        })
        .collect::<Vec<_>>();

    let response = UpcomingReminderResponse {
        upcoming_reminders: reminders,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn update_reminder(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    payload: web::Json<ReminderUpdateRequest>,
) -> Result<impl Responder, ApiError> {
    let reminder_id = path.into_inner();
    let conn = state.db.lock().expect("db lock");
    let reminder = repository::get_reminder(&conn, reminder_id)
        .map_err(|_| ApiError::not_found("Reminder not found"))?
        .ok_or_else(|| ApiError::not_found("Reminder not found"))?;
    if reminder.status == "pending" && payload.status != "dismissed" {
        return Err(ApiError::validation("Invalid status transition"));
    }
    if reminder.status == "sent" && payload.status != "dismissed" {
        return Err(ApiError::validation("Invalid status transition"));
    }
    repository::update_reminder_status(&conn, reminder_id, &payload.status)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to update reminder"))?;

    let response = ReminderUpdateResponse {
        reminder_id,
        status: payload.status.clone(),
        updated_at: Utc::now(),
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn delete_reminder(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<impl Responder, ApiError> {
    let reminder_id = path.into_inner();
    let conn = state.db.lock().expect("db lock");
    let removed = repository::delete_reminder(&conn, reminder_id)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to delete reminder"))?;
    if !removed {
        return Err(ApiError::not_found("Reminder not found"));
    }

    let response = ReminderDeleteResponse {
        success: true,
        message: "Reminder deleted successfully".to_string(),
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}
