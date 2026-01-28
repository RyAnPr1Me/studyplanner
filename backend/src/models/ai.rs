use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiChatRequest {
    pub user_id: Uuid,
    pub message: String,
    pub context: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SuggestedAction {
    #[serde(rename = "type")]
    pub action_type: String,
    pub description: String,
    pub action_data: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiChatResponse {
    pub response: String,
    pub suggested_actions: Vec<SuggestedAction>,
    pub conversation_id: Uuid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiSuggestRequest {
    pub user_id: Uuid,
    pub context: String,
    pub data: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiSuggestResponse {
    pub suggestions: Vec<String>,
    pub priority: String,
}
