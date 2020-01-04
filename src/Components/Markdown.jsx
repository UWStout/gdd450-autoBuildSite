import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

import ReactMarkdown from 'markdown-to-jsx'

import { useMarkdown } from './remoteDataHelpers'

const styles = theme => ({
  listItem: {
    marginTop: theme.spacing(1)
  }
})

const options = {
  overrides: {
    h1: { component: Typography, props: { gutterBottom: true, variant: 'h3' } },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h4' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'h5' } },
    h4: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      ))
    }
  }
}

export function Markdown (props) {
  return (
    <ReactMarkdown options={options} {...props} />
  )
}

export function AsyncMarkdown (props) {
  const markdownString = useMarkdown(props.URI)

  return (
    <ReactMarkdown options={options}>
      {markdownString}
    </ReactMarkdown>
  )
}

AsyncMarkdown.propTypes = {
  URI: PropTypes.string.isRequired
}
