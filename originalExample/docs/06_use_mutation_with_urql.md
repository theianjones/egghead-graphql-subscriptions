# useMutation to Add A comment to a Github Issue

Lets head over to the One Graph Graphiql editor. We are going to write a mutation to add a comment to our github issue.

You can select "Mutation" from the select box in the bottom left hand corner of the data explorer tab.

We want to use the `gitHub.newComment` mutation. This mutation requires an input object with 2 arguments: `body` and `subjectId`. 

```graphql
mutation NewComment {
  gitHub {
    addComment(
      input: {
        body: ""
        subjectId: ""
      }
    ) {
    }
  }
```


This `subjectId` is the id of the issue we are commenting on. We can re-run our `getComments` query we defined earlier to select the id.

```graphql
query GetComments {
  gitHub {
    repository(name: "egghead-graphql-subscriptions", owner: "theianjones") {
      issue(number: 1) {
        id
      }
    }
  }
}
```

Now that we have the id, we can pass that to our `NewComment` mutation.

We have to write a query in the return body so lets grab all the info we were getting in our `CommentsQuery`.

```graphql
mutation NewComment {
  gitHub {
    addComment(
      input: {
        body: "This is a new comment!!"
        subjectId: "MDU6SXNzdWU2MTQ3NzU4NDY="
      }
    ) {
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
```

When you fire this query off, you can go check to make sure your comment has shown up.

Now lets get this working in urql. We need to create an `Input` component the will fire this query when we submit.

`touch src/components/Input.js`

Let's create a simple input form:

```js
import React from 'react'

function Input({onSubmit}) {
    const [value, setValue] = React.useState('')
    const handleValueChange = (e) => {
        setValue(e.target.value)
    }
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            onSubmit(value)
            setValue('')
          }}>
          <input value={value} onChange={handleValueChange} />
          <button type="submit">Submit</button>
        </form>
    )
}

export default Input
```

Now, in that same file, lets add the `useMutation` functionality. We'll call this `NewCommentInput`.

```js
import {useMutation} from 'urql'

function NewCommentInput(){}
```

Now lets go copy our `NEW_COMMENT_MUTATION` from onegraph and add it to our file.

```js
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
```

You can see that we need to be able to pass a `body` and `subjectId` to this query.

```js
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
```

We'll pass this mutation to our `useMutation` hook.

```js
function NewCommentInput(){
    const [mutationResult, executeMutation] = useMutation(NEW_COMMENT_MUTATION)
}
```

You don't pass the variable in when you instantiate the hook because we want to be able to pass the variables in when we call `executeMutation`.

Lets create a `handleSubmit` function. Our `onSubmit` function inside of `Input` will pass us the body, so we will pass that along and add the issue id here.

```js
const handleSubmit = body => {
    executeMutation({subjectId: 'MDU6SXNzdWU2MTQ3NzU4NDY=', body})
}
```

We'll `console.log({mutationResult})` to see the result. Next, we will pass the `handleSubmit` function to our `Input` component.

```js
return (
    <Input onSumbit={handleSubmit}/>
)
```

Now we'll `export default NewCommentInput` instead of our `Input` component. And now you can add comments! You'll notice the comment list being populated with your new comment. This is urql detecting that you are creating a comment on an issue that it has queried for, so it fires a query to get the latest results. 

## Resources
- [useMutation docs](https://formidable.com/open-source/urql/docs/basics/mutations/)
