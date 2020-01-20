import React from 'react'
import PropTypes from 'prop-types'

import { useCookies } from 'react-cookie'

import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import GameDevInfoPaper from './GameDevInfoPaper.jsx'
import GameBuildListItem from './GameBuildListItem.jsx'
import { useJSON } from './remoteDataHelpers'

const useStyles = makeStyles(theme => {
  return ({
    root: {
      width: '100%'
    }
  })
})

export default function GameBuildsList (props) {
  const [cookies, setCookie] = useCookies(['expanded'])
  const classes = useStyles()

  // Retrieve complete game info for each game
  const gameList = props.gameList.map((curGame) => {
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
  const listItems = gameList.map((game) => {
    const isExpanded = !game.loading && (expanded === game.key)
    return (
      <GameBuildListItem key={game.key} game={game}
        logOpenCallback={props.logOpenCallback}
        handleExpansion={handleChange} expanded={isExpanded} />
    )
  })

  return (
    <div className={classes.root}>
      {buildMainContent(props.displayMode, props.gameTitle, gameList, listItems, props.logOpenCallback)}
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
  gameList: PropTypes.arrayOf(PropTypes.object).isRequired,
  displayMode: PropTypes.string.isRequired,
  logOpenCallback: PropTypes.func,
  gameTitle: PropTypes.string
}

GameBuildsList.defaultProps = {
  displayMode: 'list'
}
