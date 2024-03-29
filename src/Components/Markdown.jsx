import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Link } from '@mui/material'

import ReactMarkdown from 'markdown-to-jsx'
import { useMarkdown } from './remoteDataHelpers.js'

const options = {
  overrides: {
    h1: { component: Typography, props: { gutterBottom: true, variant: 'h3' } },
    h2: { component: Typography, props: { gutterBottom: true, variant: 'h4' } },
    h3: { component: Typography, props: { gutterBottom: true, variant: 'h5' } },
    h4: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link },
    li: {
      component: props => (
        <li style={{ marginTop: '8px' }}>
          <Typography component="span" {...props} />
        </li>
      )
    }
  }
}

export function Markdown (props) {
  return (
    <ReactMarkdown options={options} {...props} />
  )
}

export function AsyncMarkdown (props) {
  const { URI } = props
  const markdownString = useMarkdown(URI)

  return (
    <ReactMarkdown options={options}>
      {markdownString}
    </ReactMarkdown>
  )
}

AsyncMarkdown.propTypes = {
  URI: PropTypes.string.isRequired
}
