import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Container } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import Copyright from './Copyright.jsx'

export default function PageFooter (props) {
  const { footerTitle, children, ...rest } = props
  const theme = useTheme()

  return (
    <footer style={{
      backgroundColor: theme.palette.background.paper,
      marginTop: theme.spacing(8),
      padding: theme.spacing(3, 0)
    }}
    >
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
