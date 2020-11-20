import React from 'react'
import logo from './logo.svg'
import './App.css'
import {AuthContext} from './contexts/AuthContext'
import Comments from './components/CommentsSubscription'
import Input from './components/Input'
import IssueList from './components/IssueList'

function App() {
  const {login, status} = React.useContext(AuthContext)
  const [issues, setIssues] = React.useState([])
  const [currentIssue, setCurrentIssue] = React.useState()
  if (!status || !status.github) {
    return (
      <div>
        <h1>Log in to github</h1>
        <p>In order to see your profile, you'll have to log in with Github.</p>
        <button onClick={() => login('github')}>Log in with Github</button>
      </div>
    )
  }

  const handleIssueListLoaded = (data) => {
    const issues = data?.gitHub.repository.issues.edges.map((e) => e.node)
    setIssues(issues)
    setCurrentIssue(issues[0])
  }

  console.log(currentIssue)

  return (
    <div
      style={{
        display: 'flex',
        flexDirector: 'column',
        background: '#181d1f',
        minHeight: '100vh',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
        padding: 10,
      }}
    >
      <IssueList onLoaded={handleIssueListLoaded} onItemClick={(i) => console.log('click') || setCurrentIssue(i)} />
      {currentIssue && (
        <div style={{marginLeft: 20, maxWidth: 600, minWidth: 400}}>
          <Comments issueNumber={currentIssue.number} key={currentIssue.number} />
          <Input subjectId={currentIssue.id} key={currentIssue.id} />
        </div>
      )}
    </div>
  )
}

export default App
