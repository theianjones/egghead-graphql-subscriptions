import React from 'react'
import {useMutation} from 'urql'
function Input({onSubmit}) {
  const [value, setValue] = React.useState('')
  const handleValueChange = (e) => {
    setValue(e.target.value)
  }
  return (
    <form
      style={{position: 'sticky', bottom: 0}}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
        setValue('')
      }}
    >
      <input value={value} onChange={handleValueChange} placeholder="Message" />
      <button type="submit">↑</button>
    </form>
  )
}

const NEW_COMMENT_MUTATION = `
mutation NewCommentMutation($body:String!, $subjectId:String!) {
  gitHub {
    addComment(
      input: {
        body: $body
        subjectId: $subjectId
      }
    ) {
     	commentEdge{
        node {
          author{
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
    executeMutation({subjectId: 'MDU6SXNzdWU2OTQ1MjE0ODM=', body})
  }

  console.log({mutationResult})

  return <Input onSubmit={handleSubmit} />
}

export default NewCommentInput
