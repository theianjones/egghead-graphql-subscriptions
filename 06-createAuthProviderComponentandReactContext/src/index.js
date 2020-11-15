import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {createClient, Provider} from 'urql'
import {CLIENT_URL} from './utils/auth'

const client = createClient({
  url: CLIENT_URL,
  fetchOptions: {
    headers: {...auth.authHeaders()},
  },
})

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
