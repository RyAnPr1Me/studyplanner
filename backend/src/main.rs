use actix_cors::Cors;
use actix_web::{App, HttpServer, web};
use backend::{AppState, api, utils::config::AppConfig};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = AppConfig::from_env();
    let state = web::Data::new(
        AppState::new(config.clone()).expect("failed to initialize database"),
    );

    HttpServer::new(move || {
        App::new()
            .app_data(state.clone())
            .wrap(Cors::permissive())
            .service(web::scope("/api").configure(api::configure))
    })
    .bind((config.host.as_str(), config.port))?
    .run()
    .await
}
