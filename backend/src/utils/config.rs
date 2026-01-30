use std::env;

use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub database_path: String,
    pub data_dir: String,
    pub ai_provider: String,
    pub openrouter_api_key: Option<String>,
    pub openrouter_model: String,
    pub openrouter_base_url: String,
    pub openrouter_referer: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        let host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
        let port = env::var("SERVER_PORT")
            .ok()
            .and_then(|value| value.parse::<u16>().ok())
            .unwrap_or(8080);
        let database_path = env::var("DATABASE_PATH")
            .unwrap_or_else(|_| "data/database/studyplanner.db".to_string());
        let data_dir = env::var("DATA_DIR").unwrap_or_else(|_| "data".to_string());
        let ai_provider = env::var("AI_PROVIDER").unwrap_or_else(|_| "openrouter".to_string());
        let openrouter_api_key = env::var("OPENROUTER_API_KEY").ok();
        let openrouter_model = env::var("OPENROUTER_MODEL")
            .unwrap_or_else(|_| "openai/gpt-4o-mini".to_string());
        let openrouter_base_url = env::var("OPENROUTER_BASE_URL")
            .unwrap_or_else(|_| "https://openrouter.ai/api/v1".to_string());
        let openrouter_referer = env::var("OPENROUTER_REFERER").ok();
        Self {
            host,
            port,
            database_path,
            data_dir,
            ai_provider,
            openrouter_api_key,
            openrouter_model,
            openrouter_base_url,
            openrouter_referer,
        }
    }

    pub fn for_test() -> Self {
        let data_dir = env::temp_dir().join(format!("studyplanner-{}", Uuid::new_v4()));
        Self {
            host: "127.0.0.1".to_string(),
            port: 0,
            database_path: ":memory:".to_string(),
            data_dir: data_dir.to_string_lossy().to_string(),
            ai_provider: "local".to_string(),
            openrouter_api_key: None,
            openrouter_model: "openai/gpt-4o-mini".to_string(),
            openrouter_base_url: "https://openrouter.ai/api/v1".to_string(),
            openrouter_referer: None,
        }
    }
}
