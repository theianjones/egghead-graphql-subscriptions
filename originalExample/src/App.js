import React from 'react'
import './App.css'
import {AuthContext} from './contexts/AuthContext'
import Comments from './components/CommentsSubscription'
import Input from './components/Input'
function App() {
  const {login, status} = React.useContext(AuthContext)
  if (!status || !status.github) {
    return (
      <div>
        <h1>Login with Github</h1>
        <p>In order to see your profile, you'll have to login with Github.</p>
        <button onClick={() => login('github')}>Login with Github</button>
      </div>
    )
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <div>
        <Comments />
        <Input />
      </div>
    </div>
  )
}

export default App
