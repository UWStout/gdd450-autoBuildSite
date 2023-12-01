import React from 'react'
import PropTypes from 'prop-types'

import { Box, ButtonGroup, Button, Grow, Paper, Popper, MenuItem, Divider, MenuList, ClickAwayListener } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

import { downloadFile } from './remoteDataHelpers'

const options = ['Download previous build', '#', 'View currrent build log', 'View previous build log']

export default function DevBuildButton (props) {
  const { linkCurrent, linkPrevious, logsCurrent, logsPrevious, logOpenCallback, buildTitle, icon, text } = props

  const anchorRef = React.useRef(null)
  const [open, setOpen] = React.useState(false)

  const linkStates = [
    linkPrevious !== undefined,
    false,
    logsCurrent !== undefined,
    logsPrevious !== undefined
  ]

  const handleClick = () => {
    downloadFile(linkCurrent)
  }

  const handleMenuItemClick = (event, index) => {
    switch (index) {
      case 0:
        downloadFile(linkPrevious)
        break

      case 2:
        if (logOpenCallback) {
          logOpenCallback(logsCurrent, 'Current build Logs for ' + buildTitle)
        }
        break

      case 3:
        if (logOpenCallback) {
          logOpenCallback(logsPrevious, 'Previous build Logs for ' + buildTitle)
        }
        break
    }
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <Box display="flex">
      <Box m="auto">
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
          <Button disabled={!linkCurrent} onClick={handleClick} endIcon={icon}>{text}</Button>
          <Button
            size="small"
            onClick={handleToggle}
            aria-haspopup="menu"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="download other builds or view logs"
          >
            <MenuIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              sx={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => {
                      if (option === '#') {
                        return (<Divider key={`${option}-${index}`} />)
                      } else {
                        return (
                          <MenuItem
                            disabled={!linkStates[index]}
                            key={option}
                            onClick={event => handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                        )
                      }
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  )
}

DevBuildButton.propTypes = {
  text: PropTypes.node.isRequired,
  buildTitle: PropTypes.string,
  linkCurrent: PropTypes.string,
  linkPrevious: PropTypes.string,
  logsCurrent: PropTypes.arrayOf(PropTypes.string),
  logsPrevious: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.node,
  logOpenCallback: PropTypes.func
}

DevBuildButton.defaultProps = {
  buildTitle: 'Current Build',
  icon: undefined,
  linkCurrent: undefined,
  linkPrevious: undefined,
  logOpenCallback: undefined,
  logsCurrent: undefined,
  logsPrevious: undefined
}
