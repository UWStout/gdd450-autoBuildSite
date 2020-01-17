import React, { useState } from 'react'
// import PropTypes from 'prop-types'

import {
  Container, CssBaseline, Button, Slide,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, Select, MenuItem, InputLabel
} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

import { LazyLog } from 'react-lazylog'

import GameBuildsList from './GameBuildsList.jsx'
import GlobalNavBar from './GlobalNavBar.jsx'
import PageFooter from './PageFooter.jsx'

import { useJSON } from './remoteDataHelpers'

// This will make the dialog window fill its vertical space and allow the log viewer to be visible
const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minHeight: '90vh',
    maxHeight: '90vh'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

// Transition component for the dialog
const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" timeout={2000} ref={ref} {...props} />
})

export default function GameBuildsPage (props) {
  const classes = useStyles()

  // Manage the log dialog state
  const [activeLog, setActiveLog] = useState({ URI: '', title: '' })
  const handleClose = () => { setActiveLog({ URI: '', title: '' }) }

  const [activeLogIndex, setActiveLogIndex] = useState(-1)
  const updateIndex = (event) => { setActiveLogIndex(event.target.value) }

  const openLog = (newLogURI, newTitle) => {
    setActiveLogIndex(-1)
    setActiveLog({ URI: newLogURI, title: newTitle })
  }

  // Retrieve the game list from the root of the server
  const GAME_INFO = useJSON('gameList.json')

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        {/* Upper page navigation */}
        { GAME_INFO && GAME_INFO !== 'wait' &&
          <GlobalNavBar title={GAME_INFO.pageTitle} showBackButton={false} />
        }
        <br />

        {/* Main game page content */}
        { GAME_INFO && GAME_INFO !== 'wait' &&
          <GameBuildsList gameList={GAME_INFO.games} logOpenCallback={openLog} />
        }
      </Container>

      {/* Page footer with copyright info and link to UWStout main page. */}
      <PageFooter footerTitle="Copyrights and Ownership" siteText="UW Stout GDD Program" siteHref="https://www.uwstout.edu">
        These builds and the games they are associated with are the sole property and copyright of the students that made them.
        They are used here by the university with explicit permission from their development teams. Any redistribution or use
        of these game builds without the express permission of the copyright holders is strictly forbidden.
      </PageFooter>

      { /* If there is an active log, show it in a large modal dialog */ }
      { activeLog?.URI !== '' &&
        makeLogDialog(activeLog.URI, activeLogIndex, activeLog.title, updateIndex, handleClose, classes)
      }
    </React.Fragment>
  )
}

/**
 * This function will make a modal dialog to show log files for the build
 *
 * @param {string[]} logURIs URL where the log data is located.
 * @param {string} tile title for the dialog.
 * @param {function} changeLog callback to update the state of the current log URI.
 * @param {function} handleClose Callback for the dialog close operation.
 * @param {object} classes Style classes prepared for this component with useStyles().
 */
function makeLogDialog (logURIs, index, title, changeLog, handleClose, classes) {
  const logSelector = (
    <FormControl className={classes.formControl}>
      <InputLabel id="log-select-label">Select a Log</InputLabel>
      <Select labelId="log-select-label" id="log-select"
        value={logURIs.length === 1 ? 0 : (index === -1 ? '' : index)}
        className={classes.selectEmpty} onChange={changeLog}>
        {logURIs.map((logURI, idx) => (
          <MenuItem key={logURI} value={idx}>{logURI.split('-').pop()}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  if (logURIs.length === 1 && index !== 0) {
    changeLog({ target: { value: 0 } })
  }

  return (
    <Dialog TransitionComponent={Transition} fullWidth={true} maxWidth="lg" open={true}
      keepMounted onClose={handleClose} aria-labelledby="media-dialog-title"
      classes={{ paper: classes.dialogPaper }}>
      <DialogTitle id="media-dialog-title">{title}</DialogTitle>
      <DialogContent dividers={true}>
        {logSelector}
        { index > -1 && index < logURIs.length &&
          <LazyLog extraLines={1} enableSearch url={logURIs[index]} selectableLines />
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
