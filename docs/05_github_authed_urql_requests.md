# Send an Authenticated Request with Urql

Lets create a new components called `Comments`. In your terminal:

```bash
mkdir src/components && touch src/components/Comments.js
```

Inside of this component file, we'll import the usual suspects, React, and `useQuery` from Urql.

Lets take the github query we wrote in Graphiql and send it using urql. Create a variable called `CommentsQuery`.

```js
const CommentsQuery = `
query CommentListQuery(
  $repoOwner: String!
  $repoName: String!
  $issueNumber: Int!){
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        id
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
`
```

You can see that we will need to pass `repoOwner`, `repoName`, and `issueNumber` to this query via variables.

Lets call use query, passing in our query we just defined and the variables that it requires and log the result.

```js
export default Comments() {
const [result] = useQuery({
    query: COMMENTS_LIST_QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1
    },
  })

  console.log(
    {result}
  )

  return null
}
```

Now we need to import this component into our `<App/>` component.

```js
import Comments from './components/Comments'

function App() {
  const {login, status} = React.useContext(AuthContext)
  if (!status.github) {
    //...
  }

  return (
    <div className="App">
      <Comments />
    </div>
  )
}
```

Now you should see requests firing. We didn't get any data back though. You should be seeing this error:

```js
{
  "fetching": false,
  "stale": false,
  "error": {
    "name": "CombinedError",
    "message": "[GraphQL] Missing auth for GitHub. Please reauthenticate.",
    "graphQLErrors": [
      {
        "message": "Missing auth for GitHub. Please reauthenticate.",
        "path": [
          "gitHub"
        ],
        "extensions": {
          "service": "github",
          "type": "auth/missing-auth",
          "traceId": "326a1f58-e1e9-44ce-8808-bbffa50586fe"
        }
      }
    ],
    "response": {}
  },
  "data": {
    "gitHub": null
  }
}
```

We are logged into github but the server is telling us to authenticate again. Why is that?

We need to send the authentication headers to one graph! We aren't doing anything with the access token that we have stored.

Lets head over to `src/index.js` and `console.log(auth.authHeaders)`. You can see that this method gives us the headers object we need to authenticate our requests.

```js
{
  Authorization: 'Bearer some-token-string'
}
```

The urql client takes `fetchOptions` as an option for adjusting the requests that the client makes. This is where we can pass our authorization headers.

```js
const client = createClient({
  url: CLIENT_URL,
  fetchOptions: () => {
    return {
      headers: {...auth.authHeaders()},
    }
  },
})
```

Once we do that, you can head over to the browser and see that our request is returning actual data!

```js
{
  "result": {
    "fetching": false,
    "stale": false,
    "data": {
      "gitHub": {
        "repository": {
          "issue": {
            "id": "MDU6SXNzdWU2MTQ3NzU4NDY=",
            "bodyText": "Discuss graphql!",
            "comments": {
              "nodes": [],
              "__typename": "GitHubIssueCommentConnection"
            },
            "__typename": "GitHubIssue"
          },
          "__typename": "GitHubRepository"
        },
        "__typename": "GitHubQuery"
      }
    }
  }
}
```

## Resources

- [Setting Up The Client](https://formidable.com/open-source/urql/docs/basics/getting-started/#setting-up-the-client)
- [OneGraph Auth](https://www.onegraph.com/docs/logging_users_in_and_out.html#use-onegraphauth-with-apollo)
