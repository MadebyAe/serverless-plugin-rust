use lambda_http::{run, service_fn, Body, Error, IntoResponse, Request, RequestExt, Response};
use serde_json::{json};

async fn hello_world(request: Request) -> Response<Body> {
    match request.path_parameters().first("string") {
        None => {
            json!({ "message": "Default message" }).into_response().await
        },

        Some(string) => {
            let message = format!("Hello {}!", string);

            json!({ "message": message }).into_response().await
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func_closure = |request: Request| async move {
        Result::<Response<Body>, Error>::Ok(hello_world(request).await)
    };

    run(service_fn(func_closure)).await?;
    Ok(())
}

#[cfg(test)]
mod main_test;
