use lambda_http::{run, service_fn, Body, Error, IntoResponse, Request, Response};
use async_openai::{Client};
use async_openai::{types::{ChatCompletionRequestMessageArgs, CreateChatCompletionRequestArgs, Role}};
use serde_json::{from_str, from_slice, json, Value};
use serde::{Deserialize};
use regex::Regex;

#[derive(Deserialize)]
struct BodyRequest {
    location: String,
    date_from: String,
    date_to: String,
    radius: String,
}

fn extract_json_content(text: &str) -> &str {
    let re = Regex::new(r"(?s)```json\s*(.*?)\s*```|```(?:\n*)(.*?)```").unwrap();

    return re.captures(text)
        .and_then(|captures| captures.get(1).or_else(|| captures.get(2)))
        .map_or("{}", |m| m.as_str().trim())
}

async fn discovery(request: Request) -> Response<Body> {
    let body_str = request.into_body();
    let body_slice = from_slice(&body_str);
    let body_default = BodyRequest {
        date_from: "".to_string(),
        date_to: "".to_string(),
        location: "San Francisco, CA".to_string(),
        radius: "30 miles".to_string(),
    };
    let body_post: BodyRequest = body_slice.unwrap_or(body_default);
    let client = Client::new();
    let request = CreateChatCompletionRequestArgs::default()
        .model("gpt-3.5-turbo-0613")
        .max_tokens(2048u16)
        .messages([
            ChatCompletionRequestMessageArgs::default()
                .content("You are AI travel agent. Your job is to analyze the information provided by the user’s input")
                .role(Role::Assistant)
                .build().unwrap(),

            ChatCompletionRequestMessageArgs::default()
                .content(format!(
                    "I will visit {location}, Generate a list of 5 activities from {from} to {to} considering a min radius of {radius} and a max radius distance of 120 miles. Print the results in RFC8259 compliant JSON format (use ```json) with the next struct: name, date, time, category, description, latitude, longitude",
                    location = body_post.location,
                    from = body_post.date_from,
                    to = body_post.date_to,
                    radius =body_post.radius,
                ))
                .role(Role::User)
                .build().unwrap(),
            ])
        .build().unwrap();

    let response = client
        .chat()
        .create(request)
        .await
        .unwrap();

    let data_str = response.choices[0].message.content.clone();
    let data_content = extract_json_content(&data_str);
    let data: Value = from_str(&data_content).unwrap();

    return json!({ "data": data, "finish_reason": response.choices[0].finish_reason }).into_response().await;
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func_closure = |request: Request| async move {
         Result::<Response<Body>, Error>::Ok(discovery(request).await)
    };

    run(service_fn(func_closure)).await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_extract_json_content() {
        let input = r#"
            Some text here
            ```json
            {"name": "John Connor", "age": 30}
            ```
            Some more text here
        "#;
        let output = r#"{"name": "John Connor", "age": 30}"#;

        assert_eq!(extract_json_content(input), output);
    }

    #[test]
    fn test_extract_markup_content() {
        let input = r#"
            Some text here
            ```
            {"name": "John Connor", "age": 30}
            ```
            Some more text here
        "#;
        let output = r#"{"name": "John Connor", "age": 30}"#;

        assert_eq!(extract_json_content(input), output);
    }

    #[test]
    fn test_extract_plain_content() {
        let input = r#"
            Some text here

            Some more text here
        "#;
        let output = r#"{}"#;

        assert_eq!(extract_json_content(input), output);
    }

    #[test]
    fn test_extract_none_content() {
        let input = r#""#;
        let output = r#"{}"#;

        assert_eq!(extract_json_content(input), output);
    }

    #[test]
    fn test_extract_as_empty_json_content() {
        let input = r#"{}"#;
        let output = r#"{}"#;

        assert_eq!(extract_json_content(input), output);
    }
}
