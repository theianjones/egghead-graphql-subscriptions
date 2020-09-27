import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {
  createClient,
  Provider,
  defaultExchanges,
  subscriptionExchange,
} from 'urql'
import {SubscriptionClient} from 'onegraph-subscription-client'
import {AuthProvider} from './contexts/AuthContext'
import {auth, CLIENT_URL, APP_ID} from './utils/auth'

const subscriptionClient = new SubscriptionClient(APP_ID, {
  oneGraphAuth: auth,
})

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

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider auth={auth}>
      <Provider value={client}>
        <App />
      </Provider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
