# Query Data in OneGraph Graphiql Editor

Navigate to [OneGraph](https://www.onegraph.com/) and create an account.

Create a new app ([screenshot](https://share.getcloudapp.com/qGudxW8p)).

Click the data explorer tab.

Paste in this query:

```js
query {
  npm {
    package(name: "graphql") {
      name
      id
      homepage
    }
  }
}
```

When we run this query, we should get this data back:

```js
{
  "data": {
    "npm": {
      "package": {
        "name": "graphql",
        "id": "graphql",
        "homepage": "https://github.com/graphql/graphql-js"
      }
    }
  }
}
```
