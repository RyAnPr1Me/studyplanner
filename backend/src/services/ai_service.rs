use reqwest::Client;
use uuid::Uuid;

use crate::models::ai::{AiChatRequest, AiChatResponse, AiSuggestRequest, AiSuggestResponse};
use crate::utils::config::AppConfig;

pub struct AiService;

impl AiService {
    pub async fn chat(request: &AiChatRequest, config: &AppConfig) -> AiChatResponse {
        if config.ai_provider == "openai" {
            if let Some(api_key) = &config.openai_api_key {
                if !api_key.trim().is_empty() {
                    if let Some(response) = Self::call_openai(request, config, api_key).await {
                    return response;
                    }
                }
            }
        }
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

    pub async fn suggest(_request: &AiSuggestRequest, _config: &AppConfig) -> AiSuggestResponse {
        AiSuggestResponse {
            suggestions: vec![
                "Consider a short break.".to_string(),
                "Review key concepts.".to_string(),
            ],
            priority: "low".to_string(),
        }
    }

    async fn call_openai(request: &AiChatRequest, config: &AppConfig, api_key: &str) -> Option<AiChatResponse> {
        if config.openai_model.trim().is_empty() {
            return None;
        }
        let client = Client::new();
        let payload = serde_json::json!({
            "model": config.openai_model,
            "messages": [
                {"role": "system", "content": "You are a helpful study planner assistant."},
                {"role": "user", "content": request.message}
            ],
        });
        let response = client
            .post("https://api.openai.com/v1/chat/completions")
            .bearer_auth(api_key)
            .json(&payload)
            .send()
            .await
            .ok()?;
        let body: serde_json::Value = response.json().await.ok()?;
        let reply = body
            .get("choices")
            .and_then(|choices| choices.get(0))
            .and_then(|choice| choice.get("message"))
            .and_then(|message| message.get("content"))
            .and_then(|content| content.as_str())
            .unwrap_or("I can help you with your study plan.")
            .to_string();
        Some(AiChatResponse {
            response: reply,
            suggested_actions: Vec::new(),
            conversation_id: Uuid::new_v4(),
        })
    }
}
