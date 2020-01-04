import React from 'react'
import PropTypes from 'prop-types'

import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => {
  return ({
    panelDetails: {
      borderTop: '1px solid rgba(0, 0, 0, .125)'
    }
  })
})

export default function GameInfoExpansionPanel (props) {
  const classes = useStyles()

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
        aria-controls={`${props.panelID}-content`}
        id={`${props.panelID}-header`}>
        <Typography gutterBottom variant="h5">{props.title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.panelDetails}>
        {props.children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

GameInfoExpansionPanel.propTypes = {
  panelID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}
