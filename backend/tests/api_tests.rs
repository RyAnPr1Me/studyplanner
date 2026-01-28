use actix_web::{App, test, web};

use backend::{AppState, api};

#[actix_web::test]
async fn generate_plan_returns_plan() {
    let state = web::Data::new(AppState::new());
    let app = test::init_service(App::new().app_data(state.clone()).service(web::scope("/api").configure(api::configure))).await;

    let payload = serde_json::json!({
        "user_id": "00000000-0000-0000-0000-000000000001",
        "subjects": ["Math"],
        "goals": "Exam prep",
        "study_hours_per_day": 4,
        "difficulty_level": "beginner",
        "start_date": "2026-02-01"
    });

    let req = test::TestRequest::post()
        .uri("/api/plans/generate")
        .set_json(&payload)
        .to_request();
    let resp: serde_json::Value = test::call_and_read_body_json(&app, req).await;

    assert!(resp.get("data").is_some());
    assert!(resp["data"].get("plan_id").is_some());
}

#[actix_web::test]
async fn generate_tool_returns_tool() {
    let state = web::Data::new(AppState::new());
    let app = test::init_service(App::new().app_data(state.clone()).service(web::scope("/api").configure(api::configure))).await;

    let payload = serde_json::json!({
        "user_id": "00000000-0000-0000-0000-000000000002",
        "tool_type": "calculator",
        "context": "Quadratic equations",
        "requirements": "Solve ax^2 + bx + c = 0",
        "ui_preferences": {"theme": "light", "size": "medium"}
    });

    let req = test::TestRequest::post()
        .uri("/api/tools/generate")
        .set_json(&payload)
        .to_request();
    let resp: serde_json::Value = test::call_and_read_body_json(&app, req).await;

    assert_eq!(resp["data"]["tool_type"], "calculator");
    assert!(resp["data"].get("tool_id").is_some());
}
