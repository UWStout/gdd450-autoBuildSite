import React, { useState } from 'react'
// import PropTypes from 'prop-types'

import {
  Container, CssBaseline, Button, Slide,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@material-ui/core'

import { LazyLog } from 'react-lazylog'

import GameBuildsList from './GameBuildsList.jsx'
import GlobalNavBar from './GlobalNavBar.jsx'
import PageFooter from './PageFooter.jsx'

import { useJSON } from './remoteDataHelpers'

// Transition component for the dialog
const Transition = React.forwardRef(function Transition (props, ref) {
  return <Slide direction="up" timeout={2000} ref={ref} {...props} />
})

export default function GameBuildsPage (props) {
  // Manage the log dialog state
  const [activeLog, setActiveLog] = useState({ URI: '', title: '' })
  const handleClose = () => { setActiveLog({ URI: '', title: '' }) }
  const openLog = (newLogURI, newTitle) => { setActiveLog({ URI: newLogURI, title: newTitle }) }

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
        makeLogDialog(activeLog.URI, activeLog.title, handleClose)
      }
    </React.Fragment>
  )
}

/**
 * This function will make a modal dialog to show a log file for the build
 *
 * @param {string} logURI URL where the log data is located.
 * @param {string} tile title for the dialog.
 * @param {function} handleClose Callback for the dialog close operation.
 */
function makeLogDialog (logURI, title, handleClose) {
  console.log(`Called makeLogDialog(${logURI}, ${title}, ...)`)
  return (
    <Dialog TransitionComponent={Transition} fullWidth={true} maxWidth="lg" open={true}
      keepMounted onClose={handleClose} aria-labelledby="media-dialog-title">
      <DialogTitle id="media-dialog-title">{title}</DialogTitle>
      <DialogContent dividers={true}>
        <LazyLog extraLines={1} enableSearch url={logURI} selectableLines />
        {/* <Typography>Log for {logURI} titled {title} will go here</Typography> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
