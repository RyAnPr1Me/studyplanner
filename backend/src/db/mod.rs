use rusqlite::Connection;
use std::fs;
use std::path::Path;
use std::sync::Mutex;

use crate::utils::config::AppConfig;

pub mod repository;
pub mod schema;

pub struct AppState {
    pub db: Mutex<Connection>,
    pub config: AppConfig,
}

impl AppState {
    pub fn new(config: AppConfig) -> Result<Self, rusqlite::Error> {
        if config.database_path != ":memory:" {
            if let Some(parent) = Path::new(&config.database_path).parent() {
                if !parent.as_os_str().is_empty() {
                    let _ = fs::create_dir_all(parent);
                }
            }
        }
        let connection = Connection::open(&config.database_path)?;
        schema::apply(&connection)?;
        Ok(Self {
            db: Mutex::new(connection),
            config,
        })
    }
}

impl Default for AppState {
    fn default() -> Self {
        Self::new(AppConfig::for_test()).expect("default app state")
    }
}
