import React from 'react'
import {useQuery} from 'urql'

const COMMENTS_LIST_QUERY = `
query CommentListQuery(
  $repoOwner: String!
  $repoName: String!
  $issueNumber: Int!){
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        id
        bodyText
        title
        comments(last: 100) {
          nodes {
              author {
                login
              }
              body
              id
              url
              viewerDidAuthor
            }
        }
      }
    }
  }
}`

export default function Comments() {
  const [result] = useQuery({
    query: COMMENTS_LIST_QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1,
    },
  })

  if (result.fetching) {
    return 'Loading...'
  } else if (result.error) {
    return `There was an error: ${result.error}`
  }
  const issue = result.data.gitHub.repository.issue
  const comments = issue.comments.nodes
  return (
    <div style={{paddingTop: 30}}>
      <h1>{issue.title}</h1>
      {comments.length === 0 ? (
        <p>There are no comments yet.</p>
      ) : (
        <ul style={{listStyle: 'none', padding: 0}}>
          {comments.map((comment) => {
            return (
              <li key={comment.id}>
                <strong style={{paddingRight: 10}}>
                  {comment.author.login}:
                </strong>
                <span>{comment.body}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
