import React from 'react'
import Comments from './Comments'
import useCommentsHistory from './hooks/useCommentsHistory'

function QueryComments() {
  const comments = useCommentsHistory()

  return <Comments comments={comments} />
}

export default QueryComments
