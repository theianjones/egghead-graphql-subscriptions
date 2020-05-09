import React from 'react'
import logo from './logo.svg'
import './App.css'
import {useQuery} from 'urql'
import {AuthContext} from './contexts/AuthContext'

function App() {
  const {login, status} = React.useContext(AuthContext)
  if (!status.github) {
    return (
      <div>
        <h1>Login with Github</h1>
        <p>In order to see your profile, you'll have to login with Github.</p>
        <button onClick={() => login('github')}>Login with Github</button>
      </div>
    )
  }

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

export default App
