import React from 'react'
import PropTypes from 'prop-types'

import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

export default function GameInfoExpansionPanel (props) {
  const { panelID, title, children } = props

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${panelID}-content`}
        id={`${panelID}-header`}
      >
        <Typography gutterBottom variant="h5">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ borderTop: '1px solid rgba(0, 0, 0, .125)' }}>
        {children}
      </AccordionDetails>
    </Accordion>
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
