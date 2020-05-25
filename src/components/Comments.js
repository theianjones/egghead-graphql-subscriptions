import React from 'react'

export default function Comments({comments}) {
  console.log({comments})
  if (!comments || comments.length === 0) {
    return <p>There are no comments yet.</p>
  }

  return (
    <ul style={{listStyle: 'none', padding: 0}}>
      {comments.map((comment) => {
        return (
          <li key={comment.id}>
            <strong style={{paddingRight: 10}}>{comment.author.login}:</strong>
            <span>{comment.body}</span>
          </li>
        )
      })}
    </ul>
  )
}
