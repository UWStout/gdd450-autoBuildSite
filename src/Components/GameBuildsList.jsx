import React from 'react'
import PropTypes from 'prop-types'

import { useCookies } from 'react-cookie'

import { Typography } from '@mui/material'

import GameDevInfoPaper from './GameDevInfoPaper.jsx'
import GameBuildListItem from './GameBuildListItem.jsx'
import { useJSON } from './remoteDataHelpers'
import GameInfo from '../../shared/GameInfo.js'

export default function GameBuildsList (props) {
  const { gameList, displayMode, gameTitle, logOpenCallback } = props
  const [cookies, setCookie] = useCookies(['expanded'])

  // Retrieve complete game info for each game
  const gameObjList = gameList.map((curGame) => {
    // We can safely disable the warnings here because the number of games is fixed
    // at runtime so the hook is always called in order despite being in a loop.
    /* eslint-disable react-hooks/rules-of-hooks */
    const newGameInfo = useJSON(curGame.gameDataURI, curGame)
    /* eslint-enable react-hooks/rules-of-hooks */

    // Use the new game info once it is ready
    if (newGameInfo && newGameInfo !== 'wait') {
      return { ...newGameInfo, loading: false }
    } else {
      return { ...curGame, loading: true }
    }
  })

  // Track which game is currently expanded
  const [expanded, setExpanded] = React.useState(cookies.expanded || false)
  const handleChange = panel => (event, isExpanded) => {
    const value = (isExpanded ? panel : false)
    setExpanded(value)
    setCookie('expanded', value, { path: '/' })
  }

  // Build the array of games
  const listItems = gameObjList.map((game) => {
    const isExpanded = !game.loading && (expanded === game.key)
    return (
      <GameBuildListItem
        key={game.key}
        game={game}
        logOpenCallback={logOpenCallback}
        handleExpansion={handleChange}
        expanded={isExpanded}
      />
    )
  })

  return (
    <div style={{ width: '100%' }}>
      {buildMainContent(displayMode, gameTitle, gameObjList, listItems, logOpenCallback)}
    </div>
  )
}

function buildMainContent (displayMode, gameTitle, gameList, listItems, logOpenCallback) {
  if (displayMode !== 'list' && displayMode !== 'default') {
    // Attempt to find the specified game
    let curGame
    if (gameTitle) {
      curGame = gameList.find((game) => {
        return (game.title === gameTitle)
      })
    }

    // Did we find the game?
    if (!curGame) {
      return (
        <main>
          <Typography variant="h4">Error: Invalid Parameters</Typography>
          <hr />
          <Typography>&quot;gameTitle&quot; was not found. Did you remember to include it?</Typography>
        </main>
      )
    } else {
      // Render the specified game only
      return (
        <GameDevInfoPaper game={curGame} logOpenCallback={logOpenCallback} />
      )
    }
  } else {
    return listItems
  }
}

GameBuildsList.propTypes = {
  gameList: PropTypes.arrayOf(PropTypes.shape(GameInfo.shape())).isRequired,
  displayMode: PropTypes.string,
  logOpenCallback: PropTypes.func,
  gameTitle: PropTypes.string
}

GameBuildsList.defaultProps = {
  displayMode: 'list',
  gameTitle: 'unknown',
  logOpenCallback: undefined
}
