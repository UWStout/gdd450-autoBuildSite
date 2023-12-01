import React from 'react'
import PropTypes from 'prop-types'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Box } from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'

import GameDevInfoPaper from './GameDevInfoPaper.jsx'
import GameInfo from '../../shared/GameInfo.js'

const headingSX = {
  fontSize: theme => theme.typography.pxToRem(15),
  flexBasis: '33.33%',
  flexShrink: 0
}

const secondaryHeadingSX = {
  fontSize: theme => theme.typography.pxToRem(15),
  color: theme => theme.palette.text.secondary,
  marginLeft: 'auto'
}

const panelDetailsSX = {
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}

export default function GameBuildListItem (props) {
  const { game, expanded, handleExpansion, logOpenCallback } = props

  return (
    <ExpansionPanel
      TransitionProps={{ unmountOnExit: true }}
      expanded={expanded}
      onChange={handleExpansion(game.key)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${game.key}-content`}
        id={`${game.key}-header`}
      >
        <Typography sx={headingSX}>{game.title}</Typography>
        <Typography sx={secondaryHeadingSX}>{game.courseID}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails sx={panelDetailsSX}>
        <Box width={1}>
          <GameDevInfoPaper logOpenCallback={logOpenCallback} game={game} />
        </Box>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

GameBuildListItem.propTypes = {
  game: PropTypes.shape(GameInfo.shape()).isRequired,
  expanded: PropTypes.bool.isRequired,
  handleExpansion: PropTypes.func.isRequired,
  logOpenCallback: PropTypes.func
}

GameBuildListItem.defaultProps = {
  logOpenCallback: undefined
}
