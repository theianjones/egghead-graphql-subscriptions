import React from 'react'
import {useQuery} from 'urql'
import {APP_ID, auth} from '../utils/auth'

const ISSUE_LIST = `
  query IssueQuery($name: String = "egghead-graphql-subscriptions", $owner: String = "theianjones") {
    gitHub {
      repository(owner: $owner, name: $name) {
        id
        issues(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            cursor
            node {
              id
              number
              title
              comments(last: 1) {
                totalCount
                nodes {
                  id
                  bodyText
                }
              }
            }
          }
        }
      }
    }
  }
`

const useHover = (styles) => {
  const [hover, setHover] = React.useState(false)

  const onMouseEnter = () => {
    setHover(true)
  }

  const onMouseLeave = () => {
    setHover(false)
  }

  const hoverStyle = hover
    ? {
        transition: 'all .2s ease-in-out',
        ...styles,
      }
    : {
        transition: 'all .2s ease-in-out',
      }

  return [hoverStyle, {onMouseEnter, onMouseLeave}]
}

const IssueListItem = ({issue}) => {
  const [hoverStyle, hoverProps] = useHover({
    background: 'rgb(67, 67, 67)',
    cursor: 'pointer',
  })
  return (
    <li
      key={issue.id}
      {...hoverProps}
      style={{
        paddingLeft: 3,
        paddingRight: 3,
        listStyle: 'none',
        textAlign: 'justify',
        ...hoverStyle,
      }}
    >
      <h3 style={{marginBottom: 0, marginTop: 10, fontSize: 24}}>
        {issue.title}
      </h3>
      <p
        style={{
          marginTop: 5,
          marginBottom: 10,
          fontSize: 16,
          fontWeight: 400,
          opacity: 0.8,
          color: 'rgb(102, 102, 106)',
        }}
      >
        {issue.comments.nodes[0].bodyText}
      </p>
      <hr />
    </li>
  )
}

const IssueList = (props) => {
  const {onLoaded} = props
  const [{data, fetching, error}, reexecuteQuery] = useQuery({
    query: ISSUE_LIST,
    variables: {name: props.name, owner: props.owner},
  })

  React.useEffect(() => {
    if(!fetching){
      onLoaded(data)
    }
  }, [fetching])

  if (fetching) return <pre>Loading...</pre>
  const dataEl = data ? (
    <ul style={{padding: 0}}>
      {data.gitHub.repository.issues.edges.map(({node}) => (
        <IssueListItem issue={node} key={node.id} />
      ))}
    </ul>
  ) : null
  const errorEl = error ? (
    <div className="error-box">
      Error in IssueQuery. <br />
      {error.message && error.message.startsWith('[Network]') ? (
        <span>
          Make sure <strong>{window.location.origin}</strong> is in your CORS
          origins on the{' '}
          <a
            href={`https://www.onegraph.com/dashboard/app/${APP_ID}?add-cors-origin=${window.location.origin}`}
          >
            OneGraph dashboard for your app
          </a>
          .
        </span>
      ) : null}
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  ) : null

  const needsLoginService = auth.findMissingAuthServices(error)[0]

  return (
    <div>
      {dataEl}
      {errorEl}
    </div>
  )
}

export default IssueList
