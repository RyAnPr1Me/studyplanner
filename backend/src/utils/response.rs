use chrono::{DateTime, Utc};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub data: T,
    pub timestamp: DateTime<Utc>,
}

pub fn wrap<T>(data: T) -> ApiResponse<T> {
    ApiResponse {
        data,
        timestamp: Utc::now(),
    }
}
