use chrono::Utc;
use uuid::Uuid;

use crate::models::tool::{Tool, ToolGenerateRequest, ToolMetadata};
use crate::utils::config::AppConfig;

pub struct ToolService;

impl ToolService {
    pub fn generate_tool(request: &ToolGenerateRequest, config: &AppConfig) -> Tool {
        let template = match request.tool_type.as_str() {
            "calculator" => include_str!("../../templates/calculator_template.tsx"),
            "timer" => include_str!("../../templates/timer_template.tsx"),
            "flashcard" => include_str!("../../templates/flashcard_template.tsx"),
            _ => include_str!("../../templates/custom_template.tsx"),
        };
        Tool {
            tool_id: Uuid::new_v4(),
            user_id: request.user_id,
            tool_type: request.tool_type.clone(),
            name: format!("{} Tool", request.tool_type),
            description: request.context.clone(),
            component_code: template.to_string(),
            metadata: ToolMetadata {
                version: "1.0.0".to_string(),
                created_at: Utc::now(),
                ai_model: config.ai_provider.clone(),
            },
            usage_count: 0,
            last_used: None,
        }
    }
}
