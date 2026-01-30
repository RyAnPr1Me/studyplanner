use actix_web::{HttpResponse, Responder, web};

use crate::models::ai::{AiChatRequest, AiSuggestRequest};
use crate::services::ai_service::AiService;
use crate::utils::response::wrap;
use crate::db::AppState;
use crate::utils::errors::ApiError;
use crate::db::repository;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/chat").route(web::post().to(chat)))
        .service(web::resource("/suggest").route(web::post().to(suggest)));
}

async fn chat(state: web::Data<AppState>, payload: web::Json<AiChatRequest>) -> Result<impl Responder, ApiError> {
    let response = AiService::chat(&payload, &state.config).await;
    if state.config.ai_provider == "openai" {
        let conn = state.db.lock().expect("db lock");
        repository::insert_conversation(&conn, &payload, &response.response)
            .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to store conversation"))?;
    }
    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn suggest(state: web::Data<AppState>, payload: web::Json<AiSuggestRequest>) -> Result<impl Responder, ApiError> {
    let response = AiService::suggest(&payload, &state.config).await;
    Ok(HttpResponse::Ok().json(wrap(response)))
}
