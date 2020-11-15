import React from 'react'
import {useQuery} from 'urql'

const COMMENTS_QUERY = `query CommentsListQuery(
  $repoOwner: String!
  $repoName: String!
  $issueNumber: Int!
) {
  gitHub {
    repository(name: $repoName, owner: $repoOwner) {
      issue(number: $issueNumber) {
        id
        title
        bodyText
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
}
`

function Comments() {
  const [result] = useQuery({
    query: COMMENTS_QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 1,
    },
  })

  if (!result.data) {
    return 'Loading...'
  }
  console.log({result})
  return (
    <ul>
      {result.data.gitHub.repository.issue.comments.nodes.map((commentNode) => {
        return <li key={commentNode.id}>{commentNode.body}</li>
      })}
    </ul>
  )
}

export default Comments
