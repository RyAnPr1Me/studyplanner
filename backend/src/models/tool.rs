use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolGenerateRequest {
    pub user_id: Uuid,
    pub tool_type: String,
    pub context: String,
    pub requirements: String,
    pub ui_preferences: Option<UiPreferences>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UiPreferences {
    pub theme: Option<String>,
    pub size: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolMetadata {
    pub version: String,
    pub created_at: DateTime<Utc>,
    pub ai_model: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolResponse {
    pub tool_id: Uuid,
    pub tool_type: String,
    pub name: String,
    pub description: String,
    pub component_code: String,
    pub metadata: ToolMetadata,
    pub preview_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolListQuery {
    pub user_id: Uuid,
    #[serde(rename = "type")]
    pub tool_type: Option<String>,
    pub limit: Option<usize>,
    pub offset: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolListItem {
    pub tool_id: Uuid,
    pub name: String,
    pub tool_type: String,
    pub usage_count: u32,
    pub last_used: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolListResponse {
    pub tools: Vec<ToolListItem>,
    pub total: usize,
    pub limit: usize,
    pub offset: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolDetailResponse {
    pub tool_id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub tool_type: String,
    pub description: String,
    pub component_code: String,
    pub metadata: ToolMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolEditRequest {
    pub edit_instruction: String,
    pub current_state: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolEditResponse {
    pub tool_id: Uuid,
    pub updated_component_code: String,
    pub changes_summary: String,
    pub version: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolDeleteResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Clone)]
pub struct Tool {
    pub tool_id: Uuid,
    pub user_id: Uuid,
    pub tool_type: String,
    pub name: String,
    pub description: String,
    pub component_code: String,
    pub metadata: ToolMetadata,
    pub usage_count: u32,
    pub last_used: Option<DateTime<Utc>>,
}
