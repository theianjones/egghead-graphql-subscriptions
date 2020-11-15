import React from 'react'
import {useQuery} from 'urql'
import Comments from './Comments'
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

function QueryComments() {
  const [result] = useQuery({
    query: COMMENTS_QUERY,
    variables: {
      repoOwner: 'theianjones',
      repoName: 'egghead-graphql-subscriptions',
      issueNumber: 2,
    },
  })

  if (!result.data) {
    return 'Loading...'
  }

  return (
    <Comments comments={result.data.gitHub.repository.issue.comments.nodes} />
  )
}

export default QueryComments
