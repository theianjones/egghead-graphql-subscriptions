import React from 'react'
import logo from './logo.svg'
import './App.css'
import {useQuery} from 'urql'
import {AuthContext} from './contexts/AuthContext'

const QUERY = `
query MyQuery($repoOwner:String!, $repoName:String!, $issueNumber: Int!) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner){
      issue(number:$issueNumber){
        id
        title
        bodyText
      }
    }
  }
}
`

function App() {
  const {login, status} = React.useContext(AuthContext)
  const [result, reExecuteQuery] = useQuery({
    query: QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1,
    },
  })

  if (!status || !status.github) {
    return (
      <div>
        <h1>Log in to github</h1>
        <p>In order to see your profile, you'll have to log in with Github.</p>
        <button onClick={() => login('github')}>Log in with Github</button>
      </div>
    )
  }

  console.log({result})
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
