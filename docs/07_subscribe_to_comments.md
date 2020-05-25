# Subscribe to Comments

Now that we've got mutations working, we have changes that we can subscribe to. 

Lets go to the one graph console to write our first subscription.

Paste this code into your graphiql editor:

```js
subscription IssueCommentSubscription {
  github {
    issueCommentEvent(
      input: {
        repoOwner: "theianjones"
        repoName: "egghead-graphql-subscriptions"
      }
    ) {
      action
      comment {
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
```

Head over to our app and add a comment. You should see some data show up in our console:

```js
{
  "data": {
    "github": {
      "issueCommentEvent": {
        "action": "CREATED",
        "comment": {
          "id": "MDEyOklzc3VlQ29tbWVudDYzMzU3MDEwOQ==",
          "url": "https://github.com/theianjones/egghead-graphql-subscriptions/issues/1#issuecomment-633570109",
          "body": "Wow thats amazing!",
          "author": {
            "login": "theianjones"
          },
          "viewerDidAuthor": true
        }
      }
    }
  },
  "extensions": {
    "eventId": "ea45a1a9-bf66-4747-bbee-360bc0951d70",
    "subscriptionId": "8af36477-39dc-4875-b17e-aeb1bb818142"
  }
}
```


## Set up subscriptions with urql

GraphQL subscriptions use websockets to transfer data. This is what enables them to no have to refresh the page to pull in new data. We need to set up a subscription exchange inside of urql. 

First thing we need to do is `yarn add onegraph-subscription-client`. This is the subscription client urql is going to use to handle our subscription queries. Inside of `src/index.js` `import {SubscriptionClient} from 'onegraph-subscription-client'`. We will use this to set up our subscribtion client with onegraph auth.

```js
import {SubscriptionClient} from 'onegraph-subscription-client'

const subscriptionClient = new SubscriptionClient(APP_ID, {
  oneGraphAuth: auth,
})
```

Now we need to pass our `subscriptionClient` to our urql `subscriptionExchange`. urql provides us with default exchanges out of the box. Because we are going to be adding another exchange, we need to import them from urql as well.

```js
import {createClient, Provider, defaultExchanges, subscriptionExchange} from 'urql'
```

Our client config object takes an `exchanges` key which accepts an array. We'll spread our `defaultExchanges` array.

```js
const client = createClient({
  url: CLIENT_URL,
  fetchOptions: () => {
    return {
      headers: {...auth.authHeaders()},
    }
  },
  exchanges: [
    ...defaultExchanges,
  ],
})
```

Now our app will work just like it did before. We need to configure our subscription exchange.

```js
const client = createClient({
  url: CLIENT_URL,
  fetchOptions: () => {
    return {
      headers: {...auth.authHeaders()},
    }
  },
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
})
```

`subscriptionEchange` takes a config object with `forwardSubscription` which is a function that receives the graphql operation, in this case or subscription query, and passes it to our onegraph client.

Lets extract the query functionality from our `Comments` component.

```js
function Comments({comments}) {
  if (!comments || comments.length === 0) {
    return <p>There are no comments yet.</p>
  }

  return (
    <ul style={{listStyle: 'none', padding: 0}}>
      {comments.map((comment) => {
        return (
          <li key={comment.id}>
            <strong style={{paddingRight: 10}}>{comment.author.login}:</strong>
            <span>{comment.body}</span>
          </li>
        )
      })}
    </ul>
  )
}
```

This we we can use this component for a subscription or query. Now lets create a `CommentsQuery` component. 


```js
export default function CommentsQuery() {
  const [result] = useQuery({
    query: COMMENTS_LIST_QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1,
    },
  })
  if (result.fetching) {
    return 'Loading...'
  } else if (result.error) {
    return `There was an error: ${result.error}`
  }
  const issue = result.data.gitHub.repository.issue
  const comments = issue.comments.nodes

  return (
    <div style={{paddingTop: 30}}>
      <h1>{issue.title}</h1>
      <Comments comments={comments} />
    </div>
  )
}
```

This `Comments` component file is getting a little cluttered. Lets pull this out into its own file.

```js
// src/components/Comments.js
import React from 'react'

export default function Comments({comments}) {
  if (!comments || comments.length === 0) {
    return <p>There are no comments yet.</p>
  }

  return (
    <ul style={{listStyle: 'none', padding: 0}}>
      {comments.map((comment) => {
        return (
          <li key={comment.id}>
            <strong style={{paddingRight: 10}}>{comment.author.login}:</strong>
            <span>{comment.body}</span>
          </li>
        )
      })}
    </ul>
  )
}
```

```js
// src/components/CommentsQuery.js
import React from 'react'
import {useQuery} from 'urql'
import Comments from './Comments'

const COMMENTS_LIST_QUERY = `
query CommentListQuery(
  $repoOwner: String!
  $repoName: String!
  $issueNumber: Int!){
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        id
        bodyText
        title
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
}`

export default function CommentsQuery() {
  const [result] = useQuery({
    query: COMMENTS_LIST_QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1,
    },
  })
  if (result.fetching) {
    return 'Loading...'
  } else if (result.error) {
    return `There was an error: ${result.error}`
  }
  const issue = result.data.gitHub.repository.issue
  const comments = issue.comments.nodes

  return (
    <div style={{paddingTop: 30}}>
      <h1>{issue.title}</h1>
      <Comments comments={comments} />
    </div>
  )
}
```

```js
// src/index.js
import Comments from './components/CommentsQuery'
```

Lets create our `CommentsSubscription` component. 

```sh
touch src/components/CommentsSubscription.js
```

```js
import React from 'react'
import {useSubscription} from 'urql'

export default function CommentsSubscription(){

} 
```

Our app should be working the same. Lets create a `COMMENTS_LIST_SUBSCRIPTION` variable.

```js
const COMMENTS_LIST_SUBSCRIPTION = `
subscription IssueCommentSubscription {
  github {
    issueCommentEvent(
      input: {
        repoOwner: "theianjones"
        repoName: "egghead-graphql-subscriptions"
      }
    ) {
      action
      comment {
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
`
```

Now we need to call our `useSubscription`, passing our query in.

```js
export default function CommentsSubscription() {
  const [commentSubscriptionResult] = useSubscription({
    query: COMMENTS_LIST_SUBSCRIPTION,
  })

  console.log({commentSubscriptionResult})

  return null
}
```

Lets import this component in `src/index.js` to see things working.

```js
// src/index.js
import Comments from './components/CommentsSubscription'
```

Now we can head over to our browser and open up the developer console (OPT + CMD + I is the shortcut I use).

When you submit a comment, You should see some log results in the console!

```js
{
  "commentSubscriptionResult": {
    "fetching": true,
    "stale": false,
    "data": {
      "github": {
        "issueCommentEvent": {
          "action": "CREATED",
          "comment": {
            "id": "MDEyOklzc3VlQ29tbWVudDYzMzYwNDk4Ng==",
            "url": "https://github.com/theianjones/egghead-graphql-subscriptions/issues/1#issuecomment-633604986",
            "body": "hello!",
            "author": {
              "login": "theianjones"
            },
            "viewerDidAuthor": true
          }
        }
      }
    },
    "extensions": {
      "eventId": "52b00a69-c500-4d88-bc8a-f9b131b4d9ce",
      "subscriptionId": "b0d3e618-28e2-492f-9b6d-ec620c8d4835"
    }
  }
}
```

## Display subscription results

Lets import our `Comments` component in `src/components/CommentsSubscription`.

```js
// src/components/CommentsSubscription.js
import Comments from './Comments'
```

Lets destructure the comment off of the event and pass it in an array to `Comments`.

```js
// src/components/CommentsSubscription.js
export default function CommentsSubscription() {
  const [commentSubscriptionResult] = useSubscription({
    query: COMMENTS_LIST_SUBSCRIPTION,
  })
  console.log({commentSubscriptionResult})
  if (!commentSubscriptionResult.data) {
    return null
  }

  const comment =
    commentSubscriptionResult.data.github.issueCommentEvent.comment

  return <Comments comments={[comment]} />
}
```

Now when we go to the browser, you can see that only one comment is being displayed. Urql doesnt keep track of all of the events for you by default. It does give us a function so that we can keep track of the history of subscription events. We will create a `handleSubscription` function. This fuction is a lot like `reduce`. It takes the accumulator or the events, in our case comments, and the current event, and allows us to do something with each event. 

```js
// src/components/CommentsSubscription.js

const handleSubscription = (comments, commentEvent) => {

}
```

All we want to do is return an array with the new comment appended to the accumulator.

```js
// src/components/CommentsSubscription.js

const handleSubscription = (comments = [], commentEvent) => {
  return [...comments, commentEvent.github.issueCommentEvent.comment]
}
```

Now lets pass our function to `useSubscription`.

```js
const [commentSubscriptionResult] = useSubscription(
  {
    query: COMMENTS_LIST_SUBSCRIPTION,
  },
  handleSubscription,
)
```

## Resources

- [urql subscriptions](https://formidable.com/open-source/urql/docs/advanced/subscriptions/ "documentation")
  - [urql default exchanges](https://formidable.com/open-source/urql/docs/concepts/exchanges/ "documentation") 
