import React from 'react'
import PropTypes from 'prop-types'

import { Toolbar, Typography, Button } from '@mui/material'
import { ArrowBackIos as ArrowBackIcon } from '@mui/icons-material'

export default function GlobalNavBar (props) {
  const { title, showBackButton } = props

  return (
    <Toolbar sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}>
      { !!showBackButton &&
        <Button size="small" onClick={(e) => { window.remountApp() }}>
          <ArrowBackIcon />
          Return to Game List
        </Button>}
      { !showBackButton &&
        <Typography>Click on a game below to view more</Typography>}
      <Typography
        component="h2"
        variant="h5"
        color="inherit"
        align="center"
        noWrap
        sx={{ flex: 1 }}
      >
        {title}
      </Typography>
      <Button variant="outlined" size="small" target="_blank" rel="noreferrer" href="https://www.uwstout.edu/game-design-and-development">
        UW Stout GDD Program
      </Button>
    </Toolbar>
  )
}

GlobalNavBar.propTypes = {
  title: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool
}

GlobalNavBar.defaultProps = {
  showBackButton: true
}
