import React from 'react'
import PropTypes from 'prop-types'

import { Box, ButtonGroup, Button, Grow, Paper, Popper, MenuItem, Divider, MenuList } from '@material-ui/core'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuIcon from '@material-ui/icons/Menu'

import { downloadFile } from './remoteDataHelpers'

const options = ['Download previous build', '#', 'View currrent build log', 'View previous build log']

export default function DevBuildButton (props) {
  const anchorRef = React.useRef(null)
  const [open, setOpen] = React.useState(false)

  const linkStates = [
    props.linkPrevious !== undefined,
    false,
    props.logsCurrent !== undefined,
    props.logsPrevious !== undefined
  ]

  const handleClick = () => {
    downloadFile(props.linkCurrent)
  }

  const handleMenuItemClick = (event, index) => {
    switch (index) {
      case 0:
        downloadFile(props.linkPrevious)
        break

      case 2:
        if (props.logOpenCallback) {
          props.logOpenCallback(props.logsCurrent, 'Current build Logs for ' + props.buildTitle)
        }
        break

      case 3:
        if (props.logOpenCallback) {
          props.logOpenCallback(props.logsPrevious, 'Previous build Logs for ' + props.buildTitle)
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
          <Button disabled={!props.linkCurrent} onClick={handleClick} endIcon={props.icon}>{props.text}</Button>
          <Button size="small" onClick={handleToggle} aria-haspopup="menu"
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
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => {
                      if (option === '#') {
                        return (<Divider key={`${option}-${index}`} />)
                      } else {
                        return (
                          <MenuItem disabled={!linkStates[index]} key={option}
                            onClick={event => handleMenuItemClick(event, index)}>
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
