// Basic react includes
import ReactDOM from 'react-dom'
import React from 'react'

// App-wide cookie support
import { CookiesProvider } from 'react-cookie'

// Parsing of URL parameters
import queryString from 'query-string'

// Game grid which will load game pages dynamically
import GameBuildsPage from './Components/GameBuildsPage.jsx'

// Parse out any URL parameters
const URLParams = queryString.parse(window.location.search)

// Function to mount our react app
ReactDOM.render(
  <CookiesProvider>
    <GameBuildsPage displayMode={URLParams.displayMode || 'list'} gameTitle={URLParams.gameTitle} />
  </CookiesProvider>,
  document.getElementById('root')
)
