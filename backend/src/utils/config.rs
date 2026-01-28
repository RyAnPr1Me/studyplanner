use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
}

impl AppConfig {
    pub fn from_env() -> Self {
        let host = env::var("SERVER_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
        let port = env::var("SERVER_PORT")
            .ok()
            .and_then(|value| value.parse::<u16>().ok())
            .unwrap_or(8080);
        Self { host, port }
    }
}
