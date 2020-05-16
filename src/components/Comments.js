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

  console.log({result})
  return <div></div>
}
