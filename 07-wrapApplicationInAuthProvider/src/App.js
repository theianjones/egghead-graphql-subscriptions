import React from 'react'
import logo from './logo.svg'
import './App.css'
import {useQuery} from 'urql'

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
  const [result, reExecuteQuery] = useQuery({
    query: QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1,
    },
  })

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
