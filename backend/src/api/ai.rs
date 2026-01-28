use actix_web::{HttpResponse, Responder, web};

use crate::models::ai::{AiChatRequest, AiSuggestRequest};
use crate::services::ai_service::AiService;
use crate::utils::response::wrap;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/chat").route(web::post().to(chat)))
        .service(web::resource("/suggest").route(web::post().to(suggest)));
}

async fn chat(payload: web::Json<AiChatRequest>) -> impl Responder {
    let response = AiService::chat(&payload);
    HttpResponse::Ok().json(wrap(response))
}

async fn suggest(payload: web::Json<AiSuggestRequest>) -> impl Responder {
    let response = AiService::suggest(&payload);
    HttpResponse::Ok().json(wrap(response))
}
