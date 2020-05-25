import React from 'react'
import {useSubscription} from 'urql'
import Comments from './Comments'

const COMMENTS_LIST_SUBSCRIPTION = `
subscription IssueCommentSubscription {
  github {
    issueCommentEvent(
      input: {
        repoOwner: "theianjones"
        repoName: "egghead-graphql-subscriptions"
      }
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
}
`

const handleSubscription = (comments = [], commentEvent) => {
  return [...comments, commentEvent.github.issueCommentEvent.comment]
}

export default function CommentsSubscription() {
  const [commentSubscriptionResult] = useSubscription(
    {
      query: COMMENTS_LIST_SUBSCRIPTION,
    },
    handleSubscription,
  )

  if (!commentSubscriptionResult.data) {
    return null
  }

  return <Comments comments={commentSubscriptionResult.data} />
}
