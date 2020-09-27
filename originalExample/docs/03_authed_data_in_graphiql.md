# Query Authenticated Data in GraphiqL

Click the data explorer tab. Log into github ([screenshot](https://share.getcloudapp.com/QwuKdmqY)).

We will be using the github api, so you will have to log into github from one graph.

```js
query CommentListQuery(
  $repoOwner: String!
  $repoName: String!
  $issueNumber: Int!){
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        id
        title
        bodyText
        comments(last: 100) {
          nodes {
              author {
                login
              }
              body
              id
              url
              viewerDidAuthor
            }
        }
      }
    }
  }
}
```

You will need to add these `queryVariables` to the query variables section on one graph.

```js
{
  "repoOwner": "theianjones",
  "repoName":"egghead-graphql-subscriptions",
  "issueNumber": 1
}
```

Now you should see data!

```js
{
  "data": {
    "gitHub": {
      "repository": {
        "issue": {
          "id": "MDU6SXNzdWU2MTQ3NzU4NDY=",
          "bodyText": "Discuss graphql!",
          "comments": {
            "nodes": []
          }
        }
      }
    }
  }
}
```
