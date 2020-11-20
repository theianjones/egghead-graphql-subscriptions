import React from 'react'
import Comments from './Comments'
import useCommentsHistory from './hooks/useCommentsHistory'

function QueryComments({issueNumber}) {
  const comments = useCommentsHistory({issueNumber})

  return <Comments comments={comments} />
}

export default QueryComments
