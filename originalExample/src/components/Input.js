import React from 'react'
import {useMutation} from 'urql'

const NEW_COMMENT_MUTATION = `
mutation NewComment($body: String! $subjectId: String!) {
  gitHub {
    addComment(
      input: {
        body: $body
        subjectId: $subjectId
      }
    ) {
      commentEdge {
        node {
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
`

function NewCommentInput() {
  const [mutationResult, executeMutation] = useMutation(NEW_COMMENT_MUTATION)
  const handleSubmit = (body) => {
    executeMutation({subjectId: 'MDU6SXNzdWU2MTQ3NzU4NDY=', body})
  }
  console.log({mutationResult})
  return <Input onSubmit={handleSubmit} />
}

function Input({onSubmit}) {
  const [value, setValue] = React.useState('')
  const handleValueChange = (e) => {
    setValue(e.target.value)
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
        setValue('')
      }}
    >
      <input value={value} onChange={handleValueChange} />
      <button type="submit">Submit</button>
    </form>
  )
}

export default NewCommentInput
