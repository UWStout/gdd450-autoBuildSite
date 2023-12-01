// Bring in the default material-ui fonts
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

// Basic react includes
import { createRoot } from 'react-dom/client'
import React from 'react'

// App-wide cookie support
import { CookiesProvider } from 'react-cookie'

// Parsing of URL parameters
import queryString from 'query-string'

// Game grid which will load game pages dynamically
import GameBuildsPage from './Components/GameBuildsPage.jsx'

// Parse out any URL parameters
const URLParams = queryString.parse(window.location.search)

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <CookiesProvider>
    <GameBuildsPage displayMode={URLParams.displayMode || 'list'} gameTitle={URLParams.gameTitle} />
  </CookiesProvider>
)
