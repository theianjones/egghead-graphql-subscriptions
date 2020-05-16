import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {createClient, Provider} from 'urql'
import {AuthProvider} from './contexts/AuthContext'
import {auth, CLIENT_URL} from './utils/auth'

const client = createClient({
  url: CLIENT_URL,
  fetchOptions: () => {
    return {
      headers: {...auth.authHeaders()},
    }
  },
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
