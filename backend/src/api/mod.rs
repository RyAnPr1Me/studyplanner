use actix_web::web;

pub mod ai;
pub mod plans;
pub mod reminders;
pub mod tools;
pub mod users;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/plans").configure(plans::configure))
        .service(web::scope("/tools").configure(tools::configure))
        .service(web::scope("/ai").configure(ai::configure))
        .service(web::scope("/users").configure(users::configure))
        .service(web::scope("/reminders").configure(reminders::configure))
        .service(web::scope("/tasks").configure(plans::configure_task_routes));
}
