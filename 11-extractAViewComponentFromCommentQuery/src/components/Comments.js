import React from 'react'

function Comments({comments}) {
  if (!comments || comments.length === 0) {
    return null
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
      {comments.map((commentNode) => {
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
