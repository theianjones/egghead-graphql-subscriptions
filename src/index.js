import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {createClient, Provider} from 'urql'

const CLIENT_URL =
  'https://serve.onegraph.com/graphql?app_id=4fe6c187-0c9f-4f86-bc1b-c2c40acbd78c'
const client = createClient({
  url: CLIENT_URL,
})
ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
