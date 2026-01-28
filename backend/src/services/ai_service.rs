use uuid::Uuid;

use crate::models::ai::{AiChatRequest, AiChatResponse, AiSuggestRequest, AiSuggestResponse};

pub struct AiService;

impl AiService {
    pub fn chat(request: &AiChatRequest) -> AiChatResponse {
        AiChatResponse {
            response: format!("Based on your message: {}", request.message),
            suggested_actions: vec![crate::models::ai::SuggestedAction {
                action_type: "generate_tool".to_string(),
                description: "Create practice flashcards".to_string(),
                action_data: Some(serde_json::json!({"tool_type": "flashcard"})),
            }],
            conversation_id: Uuid::new_v4(),
        }
    }

    pub fn suggest(_request: &AiSuggestRequest) -> AiSuggestResponse {
        AiSuggestResponse {
            suggestions: vec![
                "Consider a short break.".to_string(),
                "Review key concepts.".to_string(),
            ],
            priority: "low".to_string(),
        }
    }
}
