# Course Project: Select Between Multiple Conversations

So we've just finished [React real-time messaging with graphql using urql and onegraph course on egghead](https://egghead.io/playlists/react-real-time-messaging-with-graphql-using-urql-and-onegraph-be5a). The [course project](https://github.com/eggheadio/eggheadio-course-notes/tree/master/react-real-time-messaging-with-graph-ql-using-urql-and-one-graph/exercises) has us building out a message selector.

So if you haven't taken the course, the app we build was a real time messaging app backed by Github issues, where the comments are the messages being displayed in real time. Heres what it looked like:

[image link](https://share.getcloudapp.com/7KubBe8q)

In this blog post, we are going to implement the feature of switching between chat rooms.

## Build the Issue Query in the graphiql editor

First, we need to navigate to [OneGraph](https://onegraph.com). Log in. Then you can select an existing app or create a new one.

Now that we're logged in, head over to the data explorer tab. This is where OneGraph's GraphiQL editor lives. We're going to build out our query to get all of the issues associated with the [egghead-graphql-subscriptions github repo](https://github.com/theianjones/egghead-graphql-subscriptions).

Heres what our GraphQL query will look like:

```graphql
query IssueList(
  $name: String = "egghead-graphql-subscriptions"
  $owner: String = "theianjones"
) {
  gitHub {
    repository(name: $name, owner: $owner) {
      id
      issues(
        first: 10
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        edges {
          cursor
          node {
            id
            title
            comments(last: 1) {
              totalCount
              nodes {
                id
                bodyText
              }
            }
          }
        }
      }
    }
  }
}

```

Pro tip: when you hover over the `$name` and `$owner` you can have the editor paramiterize the query for you:

[image link](https://share.getcloudapp.com/wbuKZolk)

Before you run the query, you are going to have to authorize your editor with GitHub. To do this, click the `Authentication` drop down and select "Log in with GitHub"

[image link](https://share.getcloudapp.com/P8um0xJk)

When you run the query, you should get some data back!

Now that we have a query, it's time to generate our code. OneGraph has a code snippet generation tool that will create the react and urql code for us.

Click "Code Exporter". Now in the 2 drop downs, select `JavaScript` in the first and `react-urql` in the second. You'll notice there's quite a few options to choose from.

[image link](https://share.getcloudapp.com/E0u4226B)

This snippet generated a full react app for us. With auth and subscriptions built into urql.

## Integrate OneGraph generated snippet

We are going to create an `IssueList` component. Create a file in our components directory: `src/components/IssueList.js`.

```sh
touch src/components/IssueList.js
```

Paste the snippet we generated in the last step. You'll notice theres urql client code that we already have present in `src/index.js` so we can go ahead and delete all of that code.

Heres what we are left with:

```js
import React from "react";
import { useQuery } from 'urql'

const ISSUE_LIST = `
  query IssueQuery($name: String = "egghead-graphql-subscriptions", $owner: String = "theianjones") {
    gitHub {
      repository(owner: $owner, name: $name) {
        id
        issues(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            cursor
            node {
              id
              number
              title
              comments(last: 1) {
                totalCount
                nodes {
                  id
                  bodyText
                }
              }
            }
          }
        }
      }
    }
  }
`;

const IssueList = (props) => {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
      query: ISSUE_LIST,
      variables: {"name": props.name, "owner": props.owner}});

    if (fetching) return <pre>Loading...</pre>;

    const dataEl = data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null;
    const errorEl = error ? (
      <div className="error-box">
        Error in IssueQuery. <br />
        {error.message && error.message.startsWith('[Network]') ? <span>Make sure <strong>{window.location.origin}</strong> is in your CORS origins on the <a href={`https://www.onegraph.com/dashboard/app/${APP_ID}?add-cors-origin=${window.location.origin}`}>OneGraph dashboard for your app</a>.</span> : null}
        <pre>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    ) : null;

    const needsLoginService = auth.findMissingAuthServices(error)[0];

    return (
      <div>
        {dataEl}
        {errorEl}
        <br />
        <button
          onClick={async () => {
            if (!needsLoginService) {
              reexecuteQuery({requestPolicy: 'cache-and-network'});
            } else {
              await auth.login(needsLoginService);
              const loginSuccess = await auth.isLoggedIn(needsLoginService);
              if (loginSuccess) {
                console.log("Successfully logged into " + needsLoginService);
                reexecuteQuery({requestPolicy: 'cache-and-network'});
              } else {
                console.log("The user did not grant auth to " + needsLoginService);
              }
            }
          }}>
            {needsLoginService ? `Log in to ${needsLoginService}` : 'Run query: IssueQuery'}
          </button>
        </div>
      );
};
```

First, we need to add `export default IssueList` at the bottom of the file. To get things rendering, lets import `APP_ID` and `auth` from `../utils/auth`

```js
import {APP_ID, auth} from '../utils/auth'
```


Now we can import our `IssueList` component in `src/App.js`. Add it right above the div:

```js
//...
+import IssueList from './components/IssueList'

function App() {
  const {login, status} = React.useContext(AuthContext)

  if (!status || !status.github) {
    return (
      <div>
        <h1>Log in to github</h1>
        <p>In order to see your profile, you'll have to log in with Github.</p>
        <button onClick={() => login('github')}>Log in with Github</button>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
+        <IssueList/>
        <div style={{minWidth: 400}}>
          <Comments />
          <Input />
        </div>
      </header>
    </div>
  )
}
//...
```

The result isn't pretty, but we have the data we need to start rendering JSX!

## Add JSX to our IssueList component

Lets render some JSX 🤩

Back in our `IssueList` component, we can see the structure of our data that we will need to map over: `data.gitHub.repository.issues.edges`.

Lets create a view component that takes each issue node, and renders it as an `li`:

```js
const IssueListItem = ({issue}) => (
  <li key={issue.id}>
    <h3>{issue.title}</h3>
    <p>{issue.comments.nodes[0].bodyText}</p>
    <hr/>
  </li>
)
```

Then we can change the `dataEl` variable to be a `ul` that maps the issues as its children:

```js
-const dataEl = data ? <pre>{JSON.stringify(data, null, 2)}</pre> : null;
+const dataEl = data ? (
+    <ul>
+      {data.gitHub.repository.issues.edges.map(({node}) => (
+        <IssueListItem issue={node} />
+      ))}
+    </ul>
+  ) : null

```

Notice that we are destructuring `node` off in the map function.

## Style Issue List

First we are going to remove the defualt padding `ul`'s have:

```js
const dataEl = data ? (
-   <ul>
+   <ul style={{padding: 0}}>
     {data.gitHub.repository.issues.edges.map(({node}) => (
       <IssueListItem issue={node} key={node.id} />
     ))}
   </ul>
) : null
```

Next we want to add some styles to our `IssueListItem` component. We want the title of the issue to stand out. We have the first message of our issue as well so we should dim it but make it visible.

```js
<li
  key={issue.id}
  style={{
    paddingLeft: 3,
    paddingRight: 3,
    listStyle: 'none',
    textAlign: 'justify',
  }}
>
  <h3 style={{marginBottom: 0, marginTop: 10, fontSize: 24}}>
    {issue.title}
  </h3>
  <p
    style={{
      marginTop: 5,
      marginBottom: 10,
      fontSize: 16,
      fontWeight: 400,
      opacity: 0.8,
      color: 'rgb(102, 102, 106)',
    }}
  >
   {issue.comments.nodes[0].bodyText}
  </p>
  <hr />
</li>
```

It would be nice to have the background color change when we hover over a list item. We dont want to pull in a whole css library to do this, so lets make a `useHover` hook to keep track of that state.

```js
const useHover = (styles) => {
  const [hover, setHover] = React.useState(false)

  const onMouseEnter = () => {
    setHover(true)
  }

  const onMouseLeave = () => {
    setHover(false)
  }

  const hoverStyle = hover
    ? {
        transition: 'all .2s ease-in-out',
        ...styles,
      }
    : {
        transition: 'all .2s ease-in-out',
      }

  return [hoverStyle, {onMouseEnter, onMouseLeave}]
}
```

With this hook, you pass in the styles you want applied when the mouse is over our element. We put in a transition to make the hover a little nicer.

Now we can get the hover styles and the props we need to apply to our list items by destructuring the return array.

```js
const IssueListItem = ({issue}) => {
+  const [hoverStyle, hoverProps] = useHover({
+    background: 'rgb(67, 67, 67)',
+    cursor: 'pointer',
+  })
  return (
    <li
      key={issue.id}
+      {...hoverProps}
      style={{
        paddingLeft: 3,
        paddingRight: 3,
        listStyle: 'none',
        textAlign: 'justify',
+        ...hoverStyle,
      }}
    >
```

We apply the styles that are returned to the style prop on our `li`. Then we take the `hoverProps` object that contains the `onMouse` events and we add those functions to our `li` as well. Last thing we'll do in this component is remove the run query button.

```js
//...
<div>
  {dataEl}
  {errorEl}
  <br />
- <button
-   onClick={async () => {
-     if (!needsLoginService) {
-       reexecuteQuery({requestPolicy: 'cache-and-network'});
-     } else {
-       await auth.login(needsLoginService);
-       const loginSuccess = await auth.isLoggedIn(needsLoginService);
-       if (loginSuccess) {
-         console.log("Successfully logged into " + needsLoginService);
-         reexecuteQuery({requestPolicy: 'cache-and-network'});
-       } else {
-         console.log("The user did not grant auth to " + needsLoginService);
-       }
-     }
-   }}>
-     {needsLoginService ? `Log in to ${needsLoginService}` : 'Run query: IssueQuery'}
-   </button>
</div>
```
Now, we can head over to `src/App.js` and get the message list rendering on the side.

```js
- <div className="App">
-   <header className="App-header">
<div
+   style={{
+     display: 'flex',
+     flexDirector: 'column',
+     background: '#181d1f',
+     minHeight: '100vh',
+     fontSize: 'calc(10px + 2vmin)',
+     color: 'white',
+     padding: 10,
+   }}
 >
   <IssueList />
- <div style={{minWidth: 400}}>
+ <div style={{marginLeft: 20, maxWidth: 600, minWidth: 400}}>
     <Comments />
     <Input />
   </div>
</div>
- </header>
- </div>
```

Since we've made some changes to how our widths and heights are working in this component, we need to adjust the styles in `<Comments/>` and `<Input/>`.

We need to adjust the `ul` in `<Comments/>`:

```js
<ul
  style={{
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    overflowY: 'scroll',
+   maxHeight: '90vh',
-   maxHeight: 560,
-   width: 400,
    margin: 0,
  }}
>
```

And in `<Input/>` we need to adjust the `button` styles.

```js
<button
 type="submit"
 style={{
   position: 'absolute',
-    right: '-30px',
+    right: '-10px'
   top: '2px',
   borderRadius: 100,
   background: '#0B55DB',
   color: 'white',
   border: 'none',
   padding: 3,
   width: 23,
   fontWeight: 900,
   fontSize: 16,
  }}
>
```

## Switch Conversations on Selection

We have 2 conversations to choose from: "Discuss GraphQL" and "egghead chat". We want to auto select the first conversation that loads in the list. Based on this conversation, we want to load the whole chat history for that conversation.

What this tells me is that we need to add a `onLoaded` prop to the `IssueList` component so that we can store the issue ids in our app component.

In our `src/App.js` component, lets add a hook to hold our issue ids.

```js
function App() {
  const {login, status} = React.useContext(AuthContext)
+  const [issueNumbers, setIssueNumbers] = React.useState([])
// ...
```

We are going to initialize the state to an empty array. Now we need to pass an `onLoaded` prop to our `<IssueList/>` component. This will be a function that takes the result of our query and plucks the issue ids off of the result.


```js
+const handleIssueListLoaded = ({githHub: {repository: issues}}) => {
+  const issueNumber = issues.edges.map(({node: issue})=> issue.number)
+  setIssueNumbers(issueNumberss)
+}

return (
  <div
    style={{
      display: 'flex',
      flexDirector: 'column',
      background: '#181d1f',
      minHeight: '100vh',
      fontSize: 'calc(10px + 2vmin)',
      color: 'white',
      padding: 10,
    }}
  >
+    <IssueList onLoaded={handleIssueListLoaded} />
-    <IssueList />
```

TODO: write up passing currentIssueNumber down to comments component
TODO: get onclick working for issue list and wire up input component correctly.
