import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {createClient, Provider} from 'urql'

const CLIENT_URL =
  'https://serve.onegraph.com/graphql?app_id=9068d449-be97-4449-a4f0-d5c663a3e7dc'
const client = createClient({url: CLIENT_URL})
ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
