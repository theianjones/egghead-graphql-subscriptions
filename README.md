# GraphQL Subscriptions

## Create Onegraph App

Navigate to [one graph](https://www.onegraph.com/) and create an account.

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

## Create Urql Client

Add urql to your project. urql requires you to add graphql as a dependency

`yarn add urql graphql` or `npm install urql graphql`

Next go to `src/index.js` and remove the service worker import, we wont be using it.

Import `createClient` and `Provider` from urql:

```js
// src/index.js
import {createClient, Provider} from 'urql'
```

Now we need to call `createClient`, passing in our graphql endpoint. We'll define out endpoint as `const CLIENT_URL`. We will use the one graph endpoint that we created earlier.

Log in to One Graph, scroll down to "App information" section and copy the the graphql endpoint.

```js
// src/index.js
const CLIENT_URL =
  'https://serve.onegraph.com/graphql?app_id=4fe6c187-0c9f-4f86-bc1b-c2c40acbd78c'
const client = createClient({
  url: CLIENT_URL,
})
```

Now we need to wrap our app with the urql provider and pass our client as the value:

```js
// src/index.js

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
```

Now lets go over to `src/App.js` and `import {useQuery} from 'urql'`

Lets define a simple query to make sure urql is working:

```js
const NPM_QUERY = `
query {
  npm {
    package(name: "graphql") {
      name
      id
      homepage
    }
  }
}
`
```

Now we will will call `useQuery` inside of our component. `useQuery` takes a configuration object that expects `query` as a parameter. We'll pass `NPM_QUERY` in.

```js
function App() {
  const [res, reExecute] = useQuery({query: NPM_QUERY})
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}
```

`useQuery` returns an array. The result of the query is in the first slot of the array while a function to re-execute the query is in the second slot.

Lets `console.log({res})` to take a look at the result of our query.

The result object will look like this:

```js
{
  data, error, extensions, fetching, state
}
```

You'll see a couple log statements where `fetching: true` and then when the query resolves:

```js
{
  "res": {
    "fetching": false,
    "stale": false,
    "data": {
      "npm": {
        "package": {
          "name": "graphql",
          "id": "graphql",
          "homepage": "https://github.com/graphql/graphql-js",
          "__typename": "NpmPackage"
        },
        "__typename": "NpmQuery"
      }
    }
  }
}
```

## Get data from authenticated endpoint in one graph

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
