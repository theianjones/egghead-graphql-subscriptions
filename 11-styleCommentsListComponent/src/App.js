import React from 'react'
import logo from './logo.svg'
import './App.css'
import {AuthContext} from './contexts/AuthContext'
import Comments from './components/Comments'

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
        <Comments />
      </header>
    </div>
  )
}

export default App
