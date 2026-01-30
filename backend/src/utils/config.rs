use std::env;

use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub database_path: String,
    pub data_dir: String,
    pub ai_provider: String,
    pub openai_api_key: Option<String>,
    pub openai_model: String,
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
        let ai_provider = env::var("AI_PROVIDER").unwrap_or_else(|_| "local".to_string());
        let openai_api_key = env::var("OPENAI_API_KEY").ok();
        let openai_model = env::var("OPENAI_MODEL").unwrap_or_else(|_| "gpt-4".to_string());
        Self {
            host,
            port,
            database_path,
            data_dir,
            ai_provider,
            openai_api_key,
            openai_model,
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
            openai_api_key: None,
            openai_model: "gpt-4".to_string(),
        }
    }
}
