import React from 'react'
import PropTypes from 'prop-types'

import { useCookies } from 'react-cookie'

import { makeStyles } from '@material-ui/core/styles'

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
      {listItems}
    </div>
  )
}

GameBuildsList.propTypes = {
  gameList: PropTypes.arrayOf(PropTypes.object).isRequired,
  logOpenCallback: PropTypes.func
}
