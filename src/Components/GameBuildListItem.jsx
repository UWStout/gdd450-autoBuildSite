import React from 'react'
import PropTypes from 'prop-types'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Box } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { makeStyles } from '@material-ui/core/styles'

import GameDevInfoPaper from './GameDevInfoPaper.jsx'

const useStyles = makeStyles(theme => {
  return ({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      marginLeft: 'auto'
    },
    panelDetails: {
      borderTop: '1px solid rgba(0, 0, 0, .125)'
    }
  })
})

export default function GameBuildListItem (props) {
  const classes = useStyles()
  return (
    <ExpansionPanel
      TransitionProps={{ unmountOnExit: true }}
      expanded={props.expanded}
      onChange={props.handleExpansion(props.game.key)}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${props.game.key}-content`}
        id={`${props.game.key}-header`}>
        <Typography className={classes.heading}>{props.game.title}</Typography>
        <Typography className={classes.secondaryHeading}>{props.game.courseID}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.panelDetails}>
        <Box width={1}>
          <GameDevInfoPaper logOpenCallback={props.logOpenCallback} game={props.game} />
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

GameBuildListItem.propTypes = {
  game: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  handleExpansion: PropTypes.func.isRequired,
  logOpenCallback: PropTypes.func
}
