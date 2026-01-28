use chrono::Utc;
use uuid::Uuid;

use crate::models::tool::{Tool, ToolGenerateRequest, ToolMetadata};

pub struct ToolService;

impl ToolService {
    pub fn generate_tool(request: &ToolGenerateRequest) -> Tool {
        Tool {
            tool_id: Uuid::new_v4(),
            user_id: request.user_id,
            tool_type: request.tool_type.clone(),
            name: format!("{} Tool", request.tool_type),
            description: request.context.clone(),
            component_code: "export default function Tool() { return null; }".to_string(),
            metadata: ToolMetadata {
                version: "1.0.0".to_string(),
                created_at: Utc::now(),
                ai_model: "mock".to_string(),
            },
            usage_count: 0,
            last_used: None,
        }
    }
}
