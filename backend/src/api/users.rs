use actix_web::{HttpResponse, Responder, web};
use uuid::Uuid;

use crate::db::AppState;
use crate::models::user::{UserProfile, UserProfileRequest, UserProfileResponse, UserStatsResponse, WeeklyActivity};
use crate::utils::{errors::ApiError, response::wrap};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/profile").route(web::post().to(upsert_profile)))
        .service(web::resource("/{user_id}/stats").route(web::get().to(get_stats)));
}

async fn upsert_profile(
    state: web::Data<AppState>,
    payload: web::Json<UserProfileRequest>,
) -> Result<impl Responder, ApiError> {
    let mut users = state.users.lock().expect("users lock");
    let existing = payload
        .email
        .as_ref()
        .and_then(|email| users.values().find(|user| user.email.as_ref() == Some(email)).map(|user| user.user_id));
    let user_id = existing.unwrap_or_else(Uuid::new_v4);
    let profile = UserProfile {
        user_id,
        name: payload.name.clone(),
        email: payload.email.clone(),
        preferences: payload.preferences.clone(),
    };
    users.insert(user_id, profile.clone());

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
    if !state.users.lock().expect("users lock").contains_key(&user_id) {
        return Err(ApiError::not_found("User not found"));
    }

    let response = UserStatsResponse {
        total_study_hours: 120.5,
        completed_tasks: 45,
        current_streak: 7,
        tools_created: 5,
        ai_interactions: 30,
        subjects_progress: serde_json::json!({"Mathematics": 75, "Physics": 60, "Chemistry": 50}),
        weekly_activity: vec![
            WeeklyActivity { date: "2026-01-22".to_string(), hours: 4.5 },
            WeeklyActivity { date: "2026-01-23".to_string(), hours: 3.0 },
        ],
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}
