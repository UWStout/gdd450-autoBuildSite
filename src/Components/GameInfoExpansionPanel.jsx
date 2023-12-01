import React from 'react'
import PropTypes from 'prop-types'

import { Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

const panelDetailsSX = {
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}

export default function GameInfoExpansionPanel (props) {
  const { panelID, title, children } = props

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${panelID}-content`}
        id={`${panelID}-header`}
      >
        <Typography gutterBottom variant="h5">{title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails sx={panelDetailsSX}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

GameInfoExpansionPanel.propTypes = {
  panelID: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node
}

GameInfoExpansionPanel.defaultProps = {
  children: null
}
