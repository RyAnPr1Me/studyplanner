use actix_web::{HttpResponse, Responder, web};
use uuid::Uuid;

use crate::db::{AppState, repository};
use crate::models::user::{UserProfileRequest, UserProfileResponse};
use crate::utils::{errors::ApiError, response::wrap};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/profile").route(web::post().to(upsert_profile)))
        .service(web::resource("/{user_id}/stats").route(web::get().to(get_stats)));
}

async fn upsert_profile(
    state: web::Data<AppState>,
    payload: web::Json<UserProfileRequest>,
) -> Result<impl Responder, ApiError> {
    let conn = state.db.lock().expect("db lock");
    let profile = repository::ensure_user(&conn, &payload)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to save user"))?;
    let user_id = profile.user_id;

    let response = UserProfileResponse {
        user_id,
        profile,
        created_at: chrono::Utc::now(),
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn get_stats(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<impl Responder, ApiError> {
    let user_id = path.into_inner();
    let conn = state.db.lock().expect("db lock");
    if repository::get_user_profile(&conn, user_id)
        .map_err(|_| ApiError::not_found("User not found"))?
        .is_none()
    {
        return Err(ApiError::not_found("User not found"));
    }
    let response = repository::get_user_stats(&conn, user_id)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to load user stats"))?;

    Ok(HttpResponse::Ok().json(wrap(response)))
}
