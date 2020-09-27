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
      issueNumber: 2,
    },
  })

  if (!result.data) {
    return 'Loading...'
  }

  return (
    <ul
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        overflowY: 'scroll',
        maxHeight: 560,
        width: 400,
        margin: 0,
      }}
    >
      {result.data.gitHub.repository.issue.comments.nodes.map((commentNode) => {
        return (
          <li
            key={commentNode.id}
            style={{
              listStyle: 'none',

              marginBottom: 6,
              width: '60%',
              alignSelf: commentNode.viewerDidAuthor
                ? 'flex-end'
                : 'flex-start',
            }}
          >
            {!commentNode.viewerDidAuthor && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  textAlign: 'justify',
                  marginLeft: 25,
                  marginBottom: 5,
                  color: '#66666A',
                }}
              >
                {commentNode.author.login}
              </h3>
            )}
            <p
              style={{
                background: commentNode.viewerDidAuthor ? '#0B55DB' : '#434343',
                borderRadius: 40,
                margin: 0,
                padding: '10px 20px',
              }}
            >
              {commentNode.body}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

export default Comments
