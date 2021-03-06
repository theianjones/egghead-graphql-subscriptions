import React from 'react'
import {useSubscription} from 'urql'
import Comments from './Comments'

const COMMENTS_LIST_SUBSCRIPTION = `subscription CommentsListSubscription(
  $repoName: String = ""
  $repoOwner: String = ""
) {
  github {
    issueCommentEvent(
      input: { repoOwner: $repoOwner, repoName: $repoName }
    ) {
      action
      comment {
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
}`

function CommentsSubscription() {
  const handleSubscription = (comments = [], commentEvent) => {
    if (!commentEvent) {
      return comments
    }
    return [...comments, commentEvent.github.issueCommentEvent.comment]
  }

  const [commentSubscriptionResult] = useSubscription(
    {
      query: COMMENTS_LIST_SUBSCRIPTION,
      variables: {
        repoName: 'egghead-graphql-subscriptions',
        repoOwner: 'theianjones',
      },
    },
    handleSubscription,
  )

  return <Comments comments={commentSubscriptionResult.data} />
}

export default CommentsSubscription
