use actix_web::{HttpResponse, Responder, web};
use uuid::Uuid;

use crate::db::{AppState, repository};
use crate::models::tool::{
    ToolDeleteResponse, ToolDetailResponse, ToolEditRequest, ToolEditResponse, ToolGenerateRequest,
    ToolListQuery, ToolListResponse, ToolResponse,
};
use crate::services::tool_service::ToolService;
use crate::utils::{errors::ApiError, response::wrap};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::resource("/generate").route(web::post().to(generate_tool)))
        .service(web::resource("").route(web::get().to(list_tools)))
        .service(web::resource("/{tool_id}").route(web::get().to(get_tool)).route(web::delete().to(delete_tool)))
        .service(web::resource("/{tool_id}/edit").route(web::post().to(edit_tool)));
}

async fn generate_tool(
    state: web::Data<AppState>,
    payload: web::Json<ToolGenerateRequest>,
) -> Result<impl Responder, ApiError> {
    let tool = ToolService::generate_tool(&payload, &state.config);
    let response = ToolResponse {
        tool_id: tool.tool_id,
        tool_type: tool.tool_type.clone(),
        name: tool.name.clone(),
        description: tool.description.clone(),
        component_code: tool.component_code.clone(),
        metadata: tool.metadata.clone(),
        preview_url: format!("/tools/preview/{}", tool.tool_id),
    };
    let conn = state.db.lock().expect("db lock");
    repository::insert_tool(&conn, &tool)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to store tool"))?;

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn list_tools(
    state: web::Data<AppState>,
    query: web::Query<ToolListQuery>,
) -> Result<impl Responder, ApiError> {
    let conn = state.db.lock().expect("db lock");
    let mut tools = repository::list_tools(&conn, query.user_id, query.tool_type.as_deref())
        .unwrap_or_default()
        .into_iter()
        .map(|tool| crate::models::tool::ToolListItem {
            tool_id: tool.tool_id,
            name: tool.name,
            tool_type: tool.tool_type,
            usage_count: tool.usage_count,
            last_used: tool.last_used,
        })
        .collect::<Vec<_>>();

    let total = tools.len();
    let limit = query.limit.unwrap_or(20);
    let offset = query.offset.unwrap_or(0);
    if offset < tools.len() {
        tools = tools.into_iter().skip(offset).take(limit).collect();
    } else {
        tools.clear();
    }

    let response = ToolListResponse {
        tools,
        total,
        limit,
        offset,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn get_tool(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<impl Responder, ApiError> {
    let tool_id = path.into_inner();
    let conn = state.db.lock().expect("db lock");
    let tool = repository::get_tool(&conn, tool_id)
        .map_err(|_| ApiError::not_found("Tool not found"))?
        .ok_or_else(|| ApiError::not_found("Tool not found"))?;

    let response = ToolDetailResponse {
        tool_id: tool.tool_id,
        user_id: tool.user_id,
        name: tool.name,
        tool_type: tool.tool_type,
        description: tool.description,
        component_code: tool.component_code,
        metadata: tool.metadata,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn edit_tool(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
    payload: web::Json<ToolEditRequest>,
) -> Result<impl Responder, ApiError> {
    let tool_id = path.into_inner();
    let conn = state.db.lock().expect("db lock");
    let tool = repository::get_tool(&conn, tool_id)
        .map_err(|_| ApiError::not_found("Tool not found"))?
        .ok_or_else(|| ApiError::not_found("Tool not found"))?;
    let updated_code = format!("{}\n// {}", tool.component_code, payload.edit_instruction);
    let version = "1.1.0".to_string();
    repository::update_tool(&conn, tool_id, &updated_code, &version)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to update tool"))?;

    let response = ToolEditResponse {
        tool_id,
        updated_component_code: updated_code,
        changes_summary: "Applied AI edits".to_string(),
        version,
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}

async fn delete_tool(
    state: web::Data<AppState>,
    path: web::Path<Uuid>,
) -> Result<impl Responder, ApiError> {
    let tool_id = path.into_inner();
    let conn = state.db.lock().expect("db lock");
    let removed = repository::delete_tool(&conn, tool_id)
        .map_err(|_| ApiError::new(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR, "DATABASE_ERROR", "Failed to delete tool"))?;
    if !removed {
        return Err(ApiError::not_found("Tool not found"));
    }

    let response = ToolDeleteResponse {
        success: true,
        message: "Tool deleted successfully".to_string(),
    };

    Ok(HttpResponse::Ok().json(wrap(response)))
}
