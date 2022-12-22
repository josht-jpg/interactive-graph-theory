mod auth;

use async_graphql::Object;

use async_graphql::{EmptyMutation, EmptySubscription, Schema};
use warp::Filter;

use async_graphql_warp::GraphQLResponse;

struct Query;

#[Object]
impl Query {
    async fn hello(&self) -> &str {
        "Hello world!"
    }
}

pub async fn run() -> Result<(), Box<dyn std::error::Error>> {
    let schema = Schema::new(Query, EmptyMutation, EmptySubscription);

    let cors = warp::cors()
        .allow_origin("http://127.0.0.1:5173")
        .allow_methods(vec!["GET", "POST", "OPTIONS"])
        .allow_headers(vec!["content-type"]);

    let filter = async_graphql_warp::graphql(schema)
        .and_then(
            |(schema, request): (
                Schema<Query, EmptyMutation, EmptySubscription>,
                async_graphql::Request,
            )| async move {
                let resp = schema.execute(request).await;
                Ok::<_, std::convert::Infallible>(async_graphql_warp::GraphQLResponse::from(resp))
            },
        )
        .with(cors);

    warp::serve(filter).run(([127, 0, 0, 1], 8000)).await;

    Ok(())
}
