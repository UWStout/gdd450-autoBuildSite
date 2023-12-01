import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Paper } from '@mui/material'

export default function AboutBox (props) {
  const { title, children } = props
  return (
    <Paper elevation={0} sx={{ padding: 2, backgroundColor: theme => theme.palette.grey[200] }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography>{children}</Typography>
    </Paper>
  )
}

AboutBox.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
}

AboutBox.defaultProps = {
  children: null,
  title: 'About this page'
}
