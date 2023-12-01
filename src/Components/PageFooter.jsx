import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Container } from '@mui/material'

import Copyright from './Copyright.jsx'

const footerSX = {
  backgroundColor: theme => theme.palette.background.paper,
  marginTop: theme => theme.spacing(8),
  padding: theme => theme.spacing(3, 0)
}

export default function PageFooter (props) {
  const { footerTitle, children, ...rest } = props

  return (
    <footer>
      {/* ^^ TODO: Needs spacing styling */}
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          {footerTitle}
        </Typography>
        {!!children &&
          <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
            {children}
          </Typography>}
        <br />
        <Copyright {...rest} />
      </Container>
    </footer>
  )
}

PageFooter.propTypes = {
  children: PropTypes.node,
  footerTitle: PropTypes.string.isRequired
}

PageFooter.defaultProps = {
  children: null
}
