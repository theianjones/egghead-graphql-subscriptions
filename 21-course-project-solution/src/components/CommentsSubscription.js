import React from 'react'
import {useSubscription} from 'urql'
import Comments from './Comments'
import useCommentsHistory from './hooks/useCommentsHistory'

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

function CommentsSubscription({issueNumber}) {
  const handleSubscription = (comments = [], commentEvent) => {
    if (!commentEvent) {
      return comments
    }
    return [...comments, commentEvent.github.issueCommentEvent.comment]
  }
  const [pauseCommentsHistory, setPauseCommentsHistory] = React.useState(false)

  const commentsHistory = useCommentsHistory({pause: pauseCommentsHistory, issueNumber})
  const commentsHistoryLength = commentsHistory.length
  React.useEffect(() => {
    if (commentsHistoryLength !== 0) {
      setPauseCommentsHistory(true)
    }
  }, [commentsHistoryLength])

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

  const commentsWithHistory = [
    ...commentsHistory,
    ...(commentSubscriptionResult.data || []),
  ]

  return <Comments comments={commentsWithHistory} />
}

export default CommentsSubscription
