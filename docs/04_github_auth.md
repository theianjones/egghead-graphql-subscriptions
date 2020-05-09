# Add Github Auth to Your Application

First things first, we will be using `onegraph-auth` to authenticate with github.

`yarn add onegraph-auth` or `npm i onegraph-auth`.

Lets create a folder called `utils` and a file inside that folder called `auth.js`

```shell
mkdir utils
touch utils/auth.js
```

Our project should look like this (excluding public and docs folders):

```
 .
├──  package.json
├──  README.md
├──  src
│  ├──  App.css
│  ├──  App.js
│  ├──  App.test.js
│  ├──  index.css
│  ├──  index.js
│  ├──  logo.svg
│  ├──  serviceWorker.js
│  └──  setupTests.js
├──  utils
│  └──  auth.js
└──  yarn.lock
```

Open up `utils/auth.js`. Start by `import OneGraphAuth from 'onegraph-auth'`.

Now we will need our `APP_ID` from one graph. You can find this by going to the applications homepage.

We will need it elsewhere in the app so lets export it.

```js
export const APP_ID = `1b5bf19c-77d3-4fae-bd70-752caa59f44b`
```

This is a good place to put the url that we are passing to our `urql` client so lets move that here:

```js
export const CLIENT_URL = `https://serve.onegraph.com/graphql?app_id=${APP_ID}`
```

Last thing we need to do is instantiate a `OneGraphAuth` object for our app to use and export it:

```js
export const auth = new OneGraphAuth({
  appId: APP_ID,
})
```

Auth.js will now look like this:

```js
import OneGraphAuth from 'onegraph-auth'
export const APP_ID = `1b5bf19c-77d3-4fae-bd70-752caa59f44b`
export const CLIENT_URL = `https://serve.onegraph.com/graphql?app_id=${APP_ID}`
export const auth = new OneGraphAuth({
  appId: APP_ID,
})
```

One good use of `React.Context` is authentication. We are going to pass this auth object into a `React.Context` for our application to consume.

One graph has put an auth package on npm called `react-onegraph` but it doesn't do exactly what we need. We need access to the auth object to pass to our urql client as well as access in our react app. So instead of installing `react-onegraph`, we will copy the component and modify it a little.

Lets add a `contexts/AuthContext.js` to our app.

```bash
mkdir contexts
touch contexts/AuthContext.js
```

Paste this code into that file

```js
import React, {Component, createContext} from 'react'
import OneGraphAuth from 'onegraph-auth'

const AuthContext = createContext()

class AuthProvider extends Component {
  state = {
    auth: null,
    status: {},
    headers: {},
  }

  componentDidMount() {
    const auth = new OneGraphAuth({
      appId: this.props.appId,
    })

    auth.servicesStatus().then((status) =>
      this.setState({
        headers: auth.authHeaders(),
        status: Object.keys(status).reduce((out, service) => {
          out[service] = status[service].isLoggedIn
          return out
        }, {}),
        auth,
      }),
    )
  }

  login = (service, callback) => {
    const {auth, status, headers} = this.state

    if (auth) {
      auth.login(service).then(() => {
        auth.isLoggedIn(service).then((isLoggedIn) => {
          callback && callback(isLoggedIn)

          this.setState({
            status: {
              ...status,
              [service]: isLoggedIn,
            },
            headers: auth.authHeaders(),
          })
        })
      })
    }
  }

  logout = (service, callback) => {
    const {auth, status, headers} = this.state

    auth.logout(service).then(() => {
      auth.isLoggedIn(service).then((isLoggedIn) => {
        callback && callback(isLoggedIn)

        this.setState({
          status: {
            ...status,
            [service]: isLoggedIn,
          },
          headers: auth.authHeaders(),
        })
      })
    })
  }

  render() {
    const {appId, children} = this.props
    const {auth, status, headers} = this.state

    const authInterface = {
      status,
      headers,
      login: this.login,
      logout: this.logout,
      appId,
    }

    return (
      <AuthContext.Provider value={authInterface}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export {AuthContext, AuthConsumer, AuthProvider}
```

We need to adjust this component so that we can pass `auth` in and use that object rather than creating one in the component.

Lets add a `getAuth` method that checks for an `auth` prop.

```js
// contexts/AuthContext.js
class AuthProvider extends Component {
  // ...
  getAuth = () => {
    const auth =
      this.props.auth ||
      new OneGraphAuth({
        appId: this.props.appId,
      })
    return auth
  }
  // ...
}
```

Now we need to modify the `componentDidMount` method.

```js
// contexts/AuthContext.js
class AuthProvider extends Component {
  // ...
  componentDidMount() {
    const auth = this.getAuth()

    auth.servicesStatus().then((status) =>
      this.setState({
        headers: auth.authHeaders(),
        status: Object.keys(status).reduce((out, service) => {
          out[service] = status[service].isLoggedIn
          return out
        }, {}),
        auth,
      }),
    )
  }
  // ...
}
```

I put a Pr in for this change [here](https://github.com/OneGraph/onegraph-client/pull/26).

Now, inside of `src/index.js`, we can import our `{auth, CLIENT_URL}` object and our `AuthProvider` and provide authentication to our app.

```js
import {AuthProvider} from './contexts/AuthContext'
import {auth, CLIENT_URL} from './utils/auth'
```

Lets delete the `CLIENT_URL` we have defined here because we have it defined in our `utils/auth.js` file.

Next, lets wrap our `<App/>` component with `AuthProvider`, passing our auth object to that provider.

Now we are set up to actually log in with github.

Open up `src/App.js` and `import {AuthContext} from '../contexts/AuthContext'`

Lets delete that query for now. We want to pull `{login, status}` off of our context.

```js
// src/App.js
const {login, status} = React.useContext(AuthContext)
```

`status.github` will be populated when the user is logged in with github.
As you can imagine, we will use the `login` function to actually log in to github. Lets return a login component if `!status.github`

```js
if (!status.github) {
  return (
    <div>
      <h1>Login with Github</h1>
      <p>In order to see your profile, you'll have to login with Github.</p>
      <button onClick={() => login('github')}>Login with Github</button>
    </div>
  )
}
```

Now you can navigate to `http://localhost:3000` and login with an oauth github flow!

## Resources

- https://github.com/OneGraph/onegraph-client/blob/master/packages/react-onegraph/src/index.js

```

```
